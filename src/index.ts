#!/usr/bin/env node

import { program } from 'commander';
import { PRReviewer } from './reviewer';
import { configManager } from './configManager';

program
  .version('1.0.0')
  .option('-t, --token <token>', 'LLMのアクセストークンを設定')
  .action(async (options) => {
    if (options.token) {
      await configManager.saveToken(options.token);
      console.log('トークンが保存されました。');
      return;
    }

    const token = await configManager.getToken();
    if (!token) {
      console.error('LLMのアクセストークンが設定されていません。--tokenオプションで設定してください。');
      return;
    }

    const reviewer = new PRReviewer(token);
    await reviewer.reviewChanges();
  });

program.parse(process.argv);
