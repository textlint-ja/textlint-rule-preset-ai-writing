---
applyTo: '**/*.ts'
---


## テスト

完全なテストは次のように行います。
README.mdのチェックをtextlintで行い、ルールのテストは`textlint-tester`を使用します。

```
npm test
```

ルールのテストは`textlint-tester`を使用して、ルールのテストを実装する

Unit Testの実行方法

```bash
npm run test:unit
```

特定のルールのみをUnit Testする場合は、以下のように実行します。

```bash
npm run test:unit -- --grep no-repetitive-expressions
```

実際に `textlint` コマンドを使ってルールを適用する場合は、以下のように実行します。

```
npm test
```

## ダミーファイルを使ったテスト

- Git管理下にダミーファイルは作らない
- `tmp/` ディレクトリを作成し、そこにダミーファイルを配置してテストを行う

```
#! /bin/bash
set -ex

mkdir -p tmp/
npm install --save-dev . textlint technological-book-corpus-ja --prefix tmp/
cd tmp
# ダミーファイルを作成
echo "ダミーファイル" > dummy.md
./node_modules/.bin/textlint --preset @textlint-ja/ai-writing dummy.md
```