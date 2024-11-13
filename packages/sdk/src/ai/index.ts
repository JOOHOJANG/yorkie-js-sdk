import { Client, SyncMode } from '@yorkie-js-sdk/src/client/client';
import { Document } from '@yorkie-js-sdk/src/document/document';

const DELAY = 150;
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
// eslint-disable-next-line @typescript-eslint/naming-convention
const EMPTY_TEXT = {
  type: 'component',
  children: [EMPTY_PARA],
  attributes: { '@ctype': 'text', layout: 'default' },
};
// eslint-disable-next-line @typescript-eslint/naming-convention
const EMPTY_HORIZONTAL_LINE = {
  type: 'component',
  attributes: {
    '@ctype': 'horizontalLine',
    layout: 'line1',
  },
  children: [],
};
type TRole = 'assistant' | 'user' | 'system';
/**
 * `AIWriter`
 */
export class AIWriter<T> {
  _gptKey: string;
  _messages: Array<{ role: TRole; content: string }> = [
    {
      role: 'system',
      content:
        '모든 대답은 한국어로, 최소한 3개의 문단을 포함해야하며, 가능한 길게 대답해야해',
    },
  ];
  _doc: Document<T>;
  _client: Client;
  constructor(gptKey: string, docKey: string, apiKey: string, host: string) {
    this._gptKey = gptKey;
    this._doc = new Document(docKey, {
      disableGC: true,
    });
    this._client = new Client(`https://${host}`, {
      apiKey,
    });
  }

  /** */
  public async initialize() {
    try {
      await this._client.activate();
      await this._client.attach(this._doc, {
        initialPresence: { userId: 'gpt' },
      });
    } catch {
      return false;
    }

    return true;
  }

  /**
   *
   */
  public async generate(query: string, context = '', compIndex = 0) {
    if (context.length) {
      this._messages.push({
        role: 'system',
        content: `이제부터 내가 하는 모든 질문은 지금 내가 준 컨텍스트를 베이스에 두고 대답해줘야해. 다음줄부터 컨텍스트를 알려줄게. \n ${context}`,
      });
    }

    const res = await this._fetch(query);

    const { content } = res.choices[0].message;

    if (!content.length) {
      return;
    }
    this._client.changeSyncMode(this._doc, SyncMode.RealtimePushOnly);

    this._doc.update((root) => {
      (root as any).text.editBulkByPath(
        [compIndex],
        [compIndex],
        [EMPTY_HORIZONTAL_LINE, EMPTY_TEXT],
      );
    });

    const lines = (content as string).split('\n').flatMap((line) => {
      let index = 0;
      const arr = [''];

      while (index < line.length) {
        arr.push(line.slice(index, index + 3));
        index += 3;
      }

      return arr;
    });

    let index = 1;
    let textIndex = 0;
    let paraIndex = 0;
    const revealText = () => {
      if (lines[index] === '') {
        paraIndex++;
        textIndex = 0;

        this._doc.update((root) => {
          (root as any).text.editByPath(
            [compIndex + 1, paraIndex],
            [compIndex + 1, paraIndex],
            EMPTY_PARA,
          );
        });
      } else {
        if (lines[index].length) {
          this._doc.update((root, presence) => {
            const path = [compIndex + 1, paraIndex, 0, textIndex];

            (root as any).text.editByPath(path, path, {
              type: 'text',
              value: lines[index],
            });

            const newPath = [
              compIndex + 1,
              paraIndex,
              0,
              textIndex + lines[index].length,
            ];

            presence.set({
              selections: [
                (root as any).text.pathRangeToPosRange([newPath, newPath]),
              ],
              userId: 'gpt',
            });

            textIndex += lines[index].length;
          });
        }
      }
      index++;

      setTimeout(() => {
        if (index < lines.length) {
          revealText();
        } else {
          this._client.changeSyncMode(this._doc, SyncMode.Realtime);
          this._doc.update((_, presence) => {
            presence.set({ userId: 'gpt' });
          });
          return Promise.resolve();
        }
      }, DELAY);
    };

    revealText();
  }

  private async _fetch(query: string) {
    this._messages.push({ role: 'user', content: query });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._gptKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // 모델 버전 선택
        messages: this._messages,
        temperature: 0.7, // 생성되는 텍스트의 다양성을 조절하는 파라미터
      }),
    });

    const res = await response.json();

    this._messages.push({
      role: 'assistant',
      content: res.choices[0].message.content,
    });

    return res;
  }
}
