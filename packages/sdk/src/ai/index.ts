import { Client } from '@yorkie-js-sdk/src/client/client';
import { Document } from '@yorkie-js-sdk/src/document/document';

const DELAY = 100;
/**
 * `AIWriter`
 */
export class AIWriter<T> {
  _apiKey: string;
  _doc: Document<T>;
  _client: Client;
  constructor(apiKey: string, docKey: string, host: string) {
    this._apiKey = apiKey;
    this._doc = new Document(docKey, {
      disableGC: true,
    });
    this._client = new Client(`http://${host}`);
  }

  /** */
  public async initialize() {
    try {
      await this._client.activate();
      await this._client.attach(this._doc);
    } catch {
      return false;
    }

    return true;
  }

  /**
   *
   */
  public async generate(query: string) {
    const res = await this._fetch(query);
    const { content } = res.choices[0].message;
    let index = 0;
    const revealText = () => {
      if (index < content.length) {
        this._update(
          [1, 0, 0, index],
          [1, 0, 0, index],
          content.slice(index, index + 10),
        );
        index += 10;
        setTimeout(revealText, DELAY);
      }
    };

    revealText();
  }

  /**
   *
   */
  public stopGenerating() {}

  private _update(
    fromPath: Array<number>,
    toPath: Array<number>,
    text: string,
  ) {
    this._doc.update((root) => {
      if (!(root as any).text) {
        return;
      }

      (root as any).text.editByPath(fromPath, toPath, {
        type: 'text',
        value: text,
      });
    });
  }

  private async _fetch(query: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // 모델 버전 선택
        messages: [{ role: 'user', content: query }],
        temperature: 0.7, // 생성되는 텍스트의 다양성을 조절하는 파라미터
      }),
    });

    return await response.json();
  }
}
