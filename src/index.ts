#!/usr/bin/env node

import { program } from 'commander';
import { PRReviewer } from './reviewer';
import { configManager } from './configManager';
import { execSync } from 'child_process';

program
  .version('1.0.0')
  .option('-t, --token <token>', 'LLMのアクセストークンを設定')
  .option('-b, --default-dest <branch>', 'デフォルトブランチを設定（デフォルト: main）')
  .option('--dest <branch>', '現在のブランチのマージ先を設定')
  .option('-s, --staged', 'ステージングされた変更のみをレビュー')
  .action(async (options) => {
    if (options.token) {
      await configManager.saveToken(options.token);
      console.log('トークンが保存されました。');
      return;
    }

    if (options.defaultDest) {
      await configManager.saveDefaultDest(options.defaultDest);
      console.log('デフォルトのマージ先ブランチが設定されました。');
      return;
    }

    if (options.dest) {
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
      await configManager.saveBranchDest(currentBranch, options.dest);
      console.log(`ブランチ "${currentBranch}" のマージ先が "${options.dest}" に設定されました。`);
      return;
    }

    const token = await configManager.getToken();
    if (!token) {
      console.error('LLMのアクセストークンが設定されていません。--tokenオプションで設定してください。');
      return;
    }

    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const dest = await configManager.getDest(currentBranch);
    
    const reviewer = new PRReviewer(token, dest);
    if (options.staged) {
      await reviewer.reviewStagedChanges();
    } else {
      await reviewer.reviewChanges();
    }
  });

program.parse(process.argv);
