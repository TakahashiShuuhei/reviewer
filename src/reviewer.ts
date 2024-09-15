import { execSync } from 'child_process';
import OpenAI from 'openai';

export class PRReviewer {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async reviewChanges(): Promise<void> {
    const diff = this.getDiff();
    const review = await this.getReviewFromLLM(diff);
    console.log(review);
  }

  private getDiff(): string {
    // ブランチの分岐点を見つける
    const baseBranch = execSync('git merge-base HEAD origin/main').toString().trim();
    // 分岐点から現在のHEADまでの差分を取得
    return execSync(`git diff ${baseBranch} HEAD`).toString();
  }

  private async getReviewFromLLM(diff: string): Promise<string> {
    const prompt = `以下のRubyコードの差分をレビューしてください：\n\n${diff}\n\nレビューコメント：`;
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });
    return response.choices[0]?.message?.content || '回答が得られませんでした。';
  }
}