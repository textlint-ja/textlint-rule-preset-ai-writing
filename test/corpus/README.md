# コーパスを使ったルール検証

ルールが「人間の書いた技術文書を誤検知せず、AIらしい文章を検出できるか」を実データで測るための仕組みです。

## 2つのメーター

- 誤検知メーター: [technological-book-corpus-ja](https://github.com/textlint-ja/technological-book-corpus-ja) の日本語技術書（人間が書いた文章）に適用する。ヒットは少ないほど良い。
- 検出メーター: `ai-samples/` のAIらしいサンプルに適用する。ヒットは多いほど良い。`codex-*.md` はcodex（GPT系）が生成した独立サンプル、`sample-*.md` は典型的なAIの癖を含めた手書きサンプル。

## 実行方法

```bash
# コーパスを取得（日本語ファイルのみ submodule で取得される）
git clone https://github.com/textlint-ja/technological-book-corpus-ja /tmp/tech-corpus
cd /tmp/tech-corpus && git submodule update --init --depth 1 && cd -

# 検証
npm run corpus-check -- --corpus /tmp/tech-corpus --ai-samples test/corpus/ai-samples
```

## 結果（誤検知メーター: 人間の技術書 284ファイル）

ファイルあたりのヒット数。少ないほど「表現ではなく構造を縛れている」ことを示す。

| ルール | 改修前 | 改修後 | 備考 |
| --- | ---: | ---: | --- |
| no-ai-emphasis-patterns | 0.011 | 0.011 | 構造的。優秀 |
| no-ai-list-formatting | 0.014 | 0.014 | 構造的。太字リード検出を追加しても誤検知は増えず |
| no-ai-empty-phrases | （新規） | 0.018 | 今回追加。AI特有の定型句に限定し低誤検知 |
| no-ai-hype-expressions | 0.194 | 0.194 | 「完全に」など一般副詞が誤検知源（現状維持） |
| no-ai-colon-continuation | 1.025 | 1.025 | 翻訳調で多発。識別力は低い |
| ai-tech-writing-guideline | 3.683 | （デフォルト無効） | 表現を縛る性質が強く誤検知が多いため opt-in 化 |

## 結果（検出メーター: AIサンプル 6ファイル）

| ルール | 改修前ヒット | 改修後ヒット | 備考 |
| --- | ---: | ---: | --- |
| no-ai-list-formatting | 9 | 18 | 太字リード検出の追加で独立codexサンプルも捕捉 |

## 所見

- 構造を縛るルール（list-formatting, emphasis-patterns）は人間の文章をほぼ誤検知せず、AI文章を高率で検出する。READMEの「表現ではなく構造を縛る」方針の正しさを実データが裏付ける。
- codexが生成した独立サンプルは文章自体は自然で、誇張語や空虚な定型句をほとんど含まなかった。それでも箇条書きの各項目を機械的に太字化する癖（`- **語**は…`）が残り、構造ルールがこれを捕捉した。表現ベースの辞書はよく書けたAI文章を取りこぼすが、構造ベースの検出は一般化する。
- ai-tech-writing-guideline は人間の技術書の方が多く検知する逆転状態だった。AI検出ではなく文章品質ガイドであるため、デフォルト無効（opt-in）に変更した。
