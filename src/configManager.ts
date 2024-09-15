import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

interface Config {
  token?: string;
  defaultDests: { [key: string]: string };
}

class ConfigManager {
  private configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), '.pr-reviewer-config.json');
  }

  async saveToken(token: string): Promise<void> {
    const config = await this.getConfig();
    config.token = token;
    await this.saveConfig(config);
  }

  async getToken(): Promise<string | null> {
    const config = await this.getConfig();
    return config.token || null;
  }

  async saveDefaultDest(branch: string): Promise<void> {
    const config = await this.getConfig();
    const repoId = this.getRepoId();
    if (!config.defaultDests) {
      config.defaultDests = {};
    }
    config.defaultDests[repoId] = branch;
    await this.saveConfig(config);
  }

  async getDefaultDest(): Promise<string> {
    const config = await this.getConfig();
    const repoId = this.getRepoId();
    return config.defaultDests?.[repoId] || 'main';
  }

  private async getConfig(): Promise<Config> {
    try {
      const configData = await fs.readFile(this.configPath, 'utf-8');
      return JSON.parse(configData);
    } catch {
      return { defaultDests: {} };
    }
  }

  private async saveConfig(config: Config): Promise<void> {
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
  }

  private getRepoId(): string {
    try {
      const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
      return remoteUrl.replace(/^(https?:\/\/|git@)/, '').replace(/\.git$/, '');
    } catch {
      throw new Error('現在のディレクトリはGitリポジトリではありません。');
    }
  }
}

export const configManager = new ConfigManager();
