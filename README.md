# textlint-rule-preset-ai-writing

AIが生成した文章によく見られる記述パターンを検出し、より自然な日本語表現を促すtextlintルールプリセットです。

## 含まれるルール

### 1. no-ai-list-formatting
リストアイテムで機械的な印象を与える可能性のある記述パターンを検出します。

#### 1-1. リストアイテムの強調パターン

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

🔍 **検出される例:**
```markdown
- ✅ 完了した項目
- ❌ 失敗した項目
- 💡 アイデア項目
- 🔥 ホットな話題
```

✅ **推奨される表現:**
```markdown
- 完了した項目
- 失敗した項目
- アイデア項目
- 注目の話題
```

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
                "allows": ["許可したいテキスト"],
                "disableBoldListItems": false,
                "disableEmojiListItems": false
            },
            "no-ai-formal-expressions": {
                "allows": ["許可したいテキスト"]
            }
        }
    }
}
```

### Options説明

#### no-ai-list-formatting
- `allows`: 指定したテキストを含む場合、エラーを報告しません
- `disableBoldListItems`: `true`にすると強調リストアイテムの検出を無効にします
- `disableEmojiListItems`: `true`にすると絵文字リストアイテムの検出を無効にします

#### no-ai-formal-expressions
- `allows`: 指定したテキストを含む場合、エラーを報告しません

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
