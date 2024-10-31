import { Client } from '@yorkie-js-sdk/src/client/client';
import { Document } from '@yorkie-js-sdk/src/document/document';

const DELAY = 100;
// eslint-disable-next-line @typescript-eslint/naming-convention
const EMPTY_PARA = {
  type: 'paragraph',
  attributes: {
    '@ctype': 'paragraph',
  },
  children: [
    {
      type: 'node',
      attributes: {
        '@ctype': 'textNode',
      },
      children: [],
    },
  ],
};
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
  public async generate(query: string, paraIndex = 0) {
    const res = await this._fetch(query);
    const { content } = res.choices[0].message;

    if (!content.length) {
      return;
    }
    const lines = (content as string).split('\n').flatMap((line) => {
      let index = 0;
      const arr = [''];

      while (index < line.length) {
        arr.push(line.slice(index, index + 10));
        index += 10;
      }

      return arr;
    });

    let index = 1;
    let textIndex = 0;
    const revealText = () => {
      if (lines[index] === '') {
        paraIndex++;
        textIndex = 0;

        this._doc.update((root) => {
          (root as any).text.editByPath(
            [1, paraIndex],
            [1, paraIndex],
            EMPTY_PARA,
          );
        });
      } else {
        if (lines[index].length) {
          this._doc.update((root) => {
            (root as any).text.editByPath(
              [1, paraIndex, 0, textIndex],
              [1, paraIndex, 0, textIndex],
              { type: 'text', value: lines[index] },
            );

            textIndex += lines[index].length;
          });
        }
      }
      index++;

      setTimeout(() => {
        if (index < lines.length) {
          revealText();
        }
      }, DELAY);
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

    const res = await response.json();

    console.log(res);

    return res;
  }
}
