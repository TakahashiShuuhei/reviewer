#!/usr/bin/env node

import { program } from 'commander';
import { PRReviewer } from './reviewer';
import { configManager } from './configManager';

program
  .version('1.0.0')
  .option('-t, --token <token>', 'LLMのアクセストークンを設定')
  .option('-b, --default-dest <branch>', 'デフォルトブランチを設定（デフォルト: main）')
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

    const token = await configManager.getToken();
    if (!token) {
      console.error('LLMのアクセストークンが設定されていません。--tokenオプションで設定してください。');
      return;
    }

    const defaultBranch = options.branch || 'main';
    const reviewer = new PRReviewer(token, defaultBranch);
    await reviewer.reviewChanges();
  });

program.parse(process.argv);
