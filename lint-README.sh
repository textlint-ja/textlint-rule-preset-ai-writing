#! /bin/bash
set -ex

mkdir -p tmp/
npm install --save-dev . textlint technological-book-corpus-ja --prefix tmp/
cd tmp
# README.mdのチェックを行う
./node_modules/.bin/textlint --preset @textlint-ja/ai-writing ../README.md

# 元のディレクトリに戻る
trap 'cd -' EXIT