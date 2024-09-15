import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

class ConfigManager {
  private configPath: string;

  constructor() {
    this.configPath = path.join(os.homedir(), '.pr-reviewer-config.json');
  }

  async saveToken(token: string): Promise<void> {
    await fs.writeFile(this.configPath, JSON.stringify({ token }));
  }

  async getToken(): Promise<string | null> {
    try {
      const config = await fs.readFile(this.configPath, 'utf-8');
      return JSON.parse(config).token;
    } catch {
      return null;
    }
  }
}

export const configManager = new ConfigManager();
