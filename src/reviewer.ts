import { execSync } from 'child_process';
import OpenAI from 'openai';

export class PRReviewer {
  private openai: OpenAI;
  private defaultBranch: string;

  constructor(apiKey: string, defaultBranch: string = 'main') {
    this.openai = new OpenAI({ apiKey });
    this.defaultBranch = defaultBranch;
  }

  async reviewChanges(): Promise<void> {
    const diff = this.getDiff();
    const review = await this.getReviewFromLLM(diff);
    console.log(review);
  }

  async reviewStagedChanges(): Promise<void> {
    const diff = this.getStagedDiff();
    const review = await this.getReviewFromLLM(diff);
    this.displayReview(review);
  }

  private getDiff(): string {
    // ブランチの分岐点を見つける
    const baseBranch = execSync(`git merge-base HEAD origin/${this.defaultBranch}`).toString().trim();
    // 分岐点から現在のHEADまでの差分を取得
    return execSync(`git diff ${baseBranch} HEAD`).toString();
  }

  private getStagedDiff(): string {
    return execSync('git diff --cached --unified=1').toString();
  }

  private async getReviewFromLLM(diff: string): Promise<string> {
    const prompt = `
    あなたはソフトウェア開発チームのメンバーがプルリクエスト（PR）を提出する前に行うセルフレビューを支援するツールです。
    以下の要件を満たすようなアシスト機能を提供してください：
    
    1. **タイポや文法の間違いチェック**:
       - 提供されたコードのdiffを解析し、コメントやドキュメント内の誤字脱字、文法の誤りを指摘。
       - 具体的な修正案を提示。
    
    2. **関数シグネチャの変更チェック**:
       - 公開されている関数のシグネチャが変更された場合、その影響を受ける呼び出し元をリストアップ。
       - 呼び出し元のコードが最新のシグネチャに対応しているか確認し、必要な修正をアラート。
    
    3. **呼び出し方法の変更チェック**:
       - 関数の呼び出し方法が変更されている箇所を特定。
       - その関数の定義側が新しい呼び出し方法に対応しているかを確認し、必要な修正をアラート。
    
    以下に変更されたファイルとそのコードのdiffを入力してください。各指摘は必ず変更ファイル名と差分と一緒に表示してください：
    
    ${diff}

    `;
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });
    return response.choices[0]?.message?.content || '回答が得られませんでした。';
  }

  private displayReview(review: string): void {
    console.log('=== レビュー結果 ===');
    console.log(review);
    console.log('==================');
  }
}