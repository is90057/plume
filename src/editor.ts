// 封裝 CM6：行號、markdown 語法、變更通知（SPEC「模組職責」）。
// 編輯內容唯一真相來源是 EditorState，讀取一律走 getContent()，不另存字串副本。
import { basicSetup, EditorView } from "codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";

let view: EditorView | null = null;
const changeListeners: Array<() => void> = [];

export function initEditor(parent: HTMLElement): void {
  view = new EditorView({
    parent,
    extensions: [
      basicSetup,
      markdown({ base: markdownLanguage }),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          for (const cb of changeListeners) cb();
        }
      }),
    ],
  });
}

export function getContent(): string {
  return view!.state.doc.toString();
}

export function setContent(text: string): void {
  view!.dispatch({
    changes: { from: 0, to: view!.state.doc.length, insert: text },
  });
}

export function onChange(cb: () => void): void {
  changeListeners.push(cb);
}
