# textlint-rule-preset-ai-writing

AIが生成した文章によく見られる記述パターンを検出し、より自然な日本語表現を促すtextlintルールプリセットです。

## 含まれるルール

### 1. no-ai-list-formatting
リストアイテムで機械的な印象を与える可能性のある記述パターンを検出します。

#### 1-1. リストアイテムの強調表現
- `allows`: 指定したパターンにマッチする場合、エラーを報告しません
  - 文字列: `"許可したいテキスト"`
  - 正規表現: `"/パターン/フラグ"` (例: `"/以下のような.*/"`)

#### no-ai-hype-expressions
- `allows`: 指定したパターンにマッチする場合、エラーを報告しません
  - 文字列: `"許可したいテキスト"`
  - 正規表現: `"/パターン/フラグ"` (例: `"/革命的な.*/"`)
- `disableAbsolutenessPatterns`: `true`にすると絶対性・完全性を演出する表現の検出を無効にします
- `disableAbstractPatterns`: `true`にすると抽象的・感覚的効果を演出する表現の検出を無効にします
- `disabledPredictivePatterns`: `true`にすると権威的・予言的な表現の検出を無効にしますパターン

🔍 **検出される例:**
```markdown
- **重要**: これは重要な項目です
- **注意**: 注意が必要な項目です
```

✅ **推奨される表現:**
```markdown
- 重要な項目: これは重要な項目です
- 注意事項: 注意が必要な項目です
```

#### 1-2. 絵文字を使ったリストアイテム

AIが機械的に使いがちな装飾的な絵文字の使用を検出します。
検出対象は、特に「華やか」で機械的な印象を与える絵文字に限定されています。

🔍 **検出される例:** 
```markdown
- ✅ 完了した項目
- ❌ 失敗した項目  
- 💡 アイデア項目
- 🔥 ホットな話題
- 🚀 開始準備完了
- ⭐ 重要項目
- 🎯 目標設定
- 📝 メモ項目
```

✅ **推奨される表現:**  
```markdown
- 完了した項目
- 失敗した項目
- アイデア項目
- 注目の話題
- 開始準備完了
- 重要項目
- 目標設定
- メモ項目
```

ℹ️ **注意**: 普通の絵文字（😀, 🍎, 🐱, 🌸など）は検出されません。

### 2. no-ai-formal-expressions
定型的で機械的な印象を与える可能性のある表現を検出します。

🔍 **検出される例:**
```markdown
以下のような手順で進めます。
次のような点に注意してください。
具体的には以下の通りです。
```

✅ **推奨される表現:**
```markdown
次の手順で進めます。
以下の点に注意してください。
具体的には次のとおりです。
```

### 3. no-ai-hype-expressions
AIライティングで過度に使用されがちな誇張表現やハイプ的な表現を検出します。自然で読みやすい文章を促進するためのルールです。

#### 3-1. 絶対性・完全性を演出する表現

🔍 **検出される例:**
```markdown
革命的な技術で業界を変えます。
これはゲームチェンジャーです。
世界初のソリューションを提供します。
究極のパフォーマンスを実現します。
完全に問題を解決します。
すべての課題を解決します。
最高の品質を保証します。
```

✅ **推奨される表現:**
```markdown
効果的な技術で業界に変化をもたらします。
これは大きな変化をもたらすでしょう。
新しいソリューションを提供します。
高いパフォーマンスを実現します。
多くの問題を解決します。
主要な課題を解決します。
高い品質を保証します。
```

#### 3-2. 抽象的・感覚的効果を演出する表現

🔍 **検出される例:**
```markdown
魔法のように動作します。
奇跡的な結果を生み出します。
可能性を解き放つソリューションです。
AIを民主化するプラットフォームです。
業務をスーパーチャージします。
```

✅ **推奨される表現:**
```markdown
スムーズに動作します。
優れた結果を生み出します。
新たな機会を創出するソリューションです。
AIを利用しやすくするプラットフォームです。
業務を効率化します。
```

#### 3-3. 権威的・予言的な表現

🔍 **検出される例:**
```markdown
業界を再定義する革新です。
未来を変える技術です。
パラダイムシフトを起こします。
不可避の変化が起こります。
次世代のソリューションです。
```

✅ **推奨される表現:**
```markdown
業界に新しい視点をもたらす革新です。
将来に影響を与える技術です。
大きな変化を起こします。
重要な変化が起こるでしょう。
新しいソリューションです。
```

## Install

Install with [npm](https://www.npmjs.com/package/textlint-rule-preset-ai-writing):

    npm install textlint-rule-preset-ai-writing

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "preset-ai-writing": true
    }
}
```

## Options

各ルールに対して個別にオプションを設定できます。

```json
{
    "rules": {
        "preset-ai-writing": {
            "no-ai-list-formatting": {
                "allows": ["許可したいテキスト", "/正規表現パターン/i"],
                "disableBoldListItems": false,
                "disableEmojiListItems": false
            },
            "no-ai-formal-expressions": {
                "allows": ["許可したいテキスト", "/正規表現パターン/"]
            },
            "no-ai-hype-expressions": {
                "allows": ["許可したいテキスト", "/正規表現パターン/"],
                "disableAbsolutenessPatterns": false,
                "disableAbstractPatterns": false,
                "disabledPredictivePatterns": false
            }
        }
    }
}
```

### Options説明

#### no-ai-list-formatting
- `allows`: 指定したパターンにマッチする場合、エラーを報告しません
  - 文字列: `"許可したいテキスト"`
  - 正規表現: `"/パターン/フラグ"` (例: `"/重要.*/i"`)
- `disableBoldListItems`: `true`にすると強調リストアイテムの検出を無効にします
- `disableEmojiListItems`: `true`にすると絵文字リストアイテムの検出を無効にします

#### no-ai-formal-expressions
- `allows`: 指定したパターンにマッチする場合、エラーを報告しません
  - 文字列: `"許可したいテキスト"`
  - 正規表現: `"/パターン/フラグ"` (例: `"/以下のような.*/"`)

### 正規表現パターンの使用例

`allows`オプションでは、[regexp-string-matcher](https://github.com/textlint/regexp-string-matcher)の形式で正規表現パターンを指定できます。

#### 基本的な使い方
```json
{
    "allows": [
        "特定の文字列",           // 完全一致
        "/パターン/",            // 正規表現（基本）
        "/パターン/i",           // 大文字小文字を無視
        "/パターン/m"            // 複数行マッチ
    ]
}
```

#### 実用例
```json
{
    "allows": [
        "/重要.*/",              // 「重要」で始まる任意の文字列
        "/\\*\\*注意\\*\\*/",   // **注意** (特殊文字をエスケープ)
        "/TODO.*/i",             // TODO で始まる文字列（大文字小文字無視）
        "/\\d{4}-\\d{2}-\\d{2}/" // 日付形式 (YYYY-MM-DD)
    ]
}
```

Via CLI

```
textlint --rule @textlint-ja/no-ai-writing README.md
```


## Changelog

See [Releases page](https://github.com/textlint-ja/textlint-rule-no-ai-writing/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-ja/textlint-rule-no-ai-writing/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
