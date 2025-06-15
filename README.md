# @textlint-ja/textlint-rule-no-ai-writing

AIが生成した文章によく見られる記述パターンを検出し、より自然な日本語表現を促すtextlintルールです。

## 検出する記述パターン

### 1. リストアイテムの強調パターン

❌ **悪い例:**
```markdown
- **重要**: これは重要な項目です
- **注意**: 注意が必要な項目です
```

✅ **良い例:**
```markdown
- 重要な項目: これは重要な項目です
- 注意事項: 注意が必要な項目です
```

### 2. 絵文字を使ったリストアイテム

❌ **悪い例:**
```markdown
- ✅ 完了した項目
- ❌ 失敗した項目
- 💡 アイデア項目
- 🔥 ホットな話題
```

✅ **良い例:**
```markdown
- 完了した項目
- 失敗した項目
- アイデア項目
- 注目の話題
```

## Install

Install with [npm](https://www.npmjs.com/package/@textlint-ja/textlint-rule-no-ai-writing):

    npm install @textlint-ja/textlint-rule-no-ai-writing

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "@textlint-ja/no-ai-writing": true
    }
}
```

## Options

```json
{
    "rules": {
        "@textlint-ja/no-ai-writing": {
            "allows": ["許可したいテキスト"],
            "disableBoldListItems": false,
            "disableEmojiListItems": false
        }
    }
}
```

### Options説明

- `allows`: 指定したテキストを含む場合、エラーを報告しません
- `disableBoldListItems`: `true`にすると強調リストアイテムの検出を無効にします
- `disableEmojiListItems`: `true`にすると絵文字リストアイテムの検出を無効にします

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
