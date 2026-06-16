# CodexとDockerで、開発環境を静かに整える

結論から言うと、CodexにDockerまわりを任せるなら、最初に「どこまで触ってよいか」を決めるのがいちばん効きます。Dockerfileは小さな変更に見えて、ビルド時間、イメージサイズ、セキュリティに波及しやすいからです。

## まず任せる範囲を狭くする

Codexはサンドボックスの中で作業でき、`workspace-write`では作業ディレクトリ内の編集に範囲を絞れます。これは、依存関係やDockerfileを調整するときの安心材料になります。あわせて`AGENTS.md`に、利用するベースイメージ、テストコマンド、禁止したい操作を書いておくと、毎回の説明が短くなります。

## Dockerfileは「読みやすさ」から直す

Docker公式ドキュメントでは、マルチステージビルドを使うと、ビルド用の道具を最終イメージに残さずに済むと説明されています。Codexには、最初から「本番イメージに不要なものを残さないで」と頼むとよいです。

- **ビルド段階**: 依存の取得と成果物の生成に集中する
- **実行段階**: 実行に必要なファイルだけを置く
- **確認段階**: `docker build`とテストを必ず実行する

## 仕上げは人間が見る

Codexは差分を作るのが得意ですが、運用上の判断までは自動で正解にできません。あなたのチームの制約を`AGENTS.md`に残し、Codexには小さく直して、必ずビルド結果まで見てもらう。この流れが、Docker対応を落ち着いた作業に変えてくれます。

参考: https://developers.openai.com/codex/concepts/sandboxing / https://developers.openai.com/codex/guides/agents-md / https://docs.docker.com/build/building/multi-stage/
