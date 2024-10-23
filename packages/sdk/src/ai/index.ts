import { Client } from '@yorkie-js-sdk/src/client/client';
import { Document } from '@yorkie-js-sdk/src/document/document';

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

  /**
   *
   */
  public async generate(query: string) {
    const res = this._fetch(query);

    console.log(res);
    return res;
  }

  /**
   *
   */
  public stopGenerating() {}

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
