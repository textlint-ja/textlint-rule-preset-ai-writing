import { matchPatterns } from "@textlint/regexp-string-matcher";
import { StringSource } from "textlint-util-to-string";
import { tokenize } from "kuromojin";

/**
 * コロンの直後にブロック要素が続くパターンを検出するルール
 *
 * 目的：
 * AI生成文章でよく見られる英語構文の直訳パターンを検出します。
 * ただし、「使用方法:」のような名詞で終わる表現は自然な日本語として許可されます。
 * 問題となるのは「実行します:」のような述語で終わる表現です。
 *
 * より自然な日本語表現：
 * - 「使用方法は以下の通りです」
 * - 「次のように使用します」
 * - 「以下の手順で実行してください」
 */
const rule = (context: any, options: any = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    const disableCodeBlock = options.disableCodeBlock ?? false;
    const disableList = options.disableList ?? false;
    const disableQuote = options.disableQuote ?? false;
    const disableTable = options.disableTable ?? false;

    // AST走査で隣接するノードの組み合わせをチェック

    const checkColonContinuation = async (paragraphNode: any, nextNode: any) => {
        // Paragraphノードのテキストを取得
        const paragraphText = getSource(paragraphNode);

        // Check if text matches any allowed patterns
        if (allows.length > 0) {
            const matches = matchPatterns(paragraphText, allows);
            if (matches.length > 0) {
                return;
            }
        }

        // コロン（半角・全角）で終わっているかチェック
        if (!/[：:]$/.test(paragraphText.trim())) {
            return;
        }

        // StringSourceを使ってMarkdownを取り除いたテキストを取得
        const stringSource = new StringSource(paragraphNode);
        const plainText = stringSource.toString().trim();

        // プレーンテキストでもコロン（半角・全角）で終わっているかチェック
        if (!/[：:]$/.test(plainText)) {
            return;
        }

        // コロンの種類を特定
        const isFullWidthColon = plainText.endsWith("：");
        const colonChar = isFullWidthColon ? "：" : ":";

        // コロンを除いたテキストを取得
        const beforeColonText = plainText.slice(0, -1);

        // kuromojinで形態素解析を行い、名詞で終わっているかを判定
        const isNoun = await (async () => {
            // 英語のテキストかどうかを判定（英語の場合はコロンが自然なので許可）
            const isEnglishText =
                /^[a-zA-Z0-9\s\-_.]+$/.test(beforeColonText.trim()) && /[a-zA-Z]/.test(beforeColonText);
            if (isEnglishText) {
                return true; // 英語テキストの場合は許可
            }

            // 短すぎる場合（1-2文字）は名詞として扱う
            if (beforeColonText.length <= 2) {
                return true;
            }

            try {
                // kuromojinで形態素解析
                const tokens = await tokenize(beforeColonText);

                if (tokens.length === 0) {
                    return true; // 解析できない場合は許可
                }

                // 最後のトークンの品詞をチェック
                const lastToken = tokens[tokens.length - 1];
                const partOfSpeech = lastToken.pos.split(",")[0]; // 大分類を取得

                // 名詞で終わっている場合は許可
                if (partOfSpeech === "名詞") {
                    return true;
                }

                // 動詞、形容詞、助動詞で終わっている場合は述語として判定
                if (["動詞", "形容詞", "助動詞"].includes(partOfSpeech)) {
                    return false;
                }

                // 接続詞の場合もエラーとする（「例えば:」等は機械的パターン）
                if (partOfSpeech === "接続詞") {
                    return false;
                }

                // その他の品詞（助詞等）の場合は文脈による
                // より保守的にエラーとする
                return false;
            } catch (error) {
                // 形態素解析でエラーが発生した場合は許可（保守的にエラーを避ける）
                return true;
            }
        })();

        if (isNoun) {
            return; // 名詞の場合はエラーにしない
        }

        // 次のノードの種類をチェック
        const shouldReport = (() => {
            if (!nextNode) return false;

            switch (nextNode.type) {
                case Syntax.CodeBlock:
                    return !disableCodeBlock;
                case Syntax.List:
                    return !disableList;
                case Syntax.BlockQuote:
                    return !disableQuote;
                case Syntax.Table:
                    return !disableTable;
                default:
                    return false;
            }
        })();

        if (shouldReport) {
            // paragraphTextでのコロン位置を計算（StringSourceとの位置差を考慮）
            const paragraphColonIndex = paragraphText.lastIndexOf(colonChar);
            const matchRange = [paragraphColonIndex, paragraphColonIndex + 1] as const;

            const ruleError = new RuleError(
                `「${beforeColonText}${colonChar}」のような述語とコロンで終わるパターンは、読み手によっては英語の構文を直訳したような印象を与える場合があります。「〜を説明します。」「次のように〜します。」のような自然な日本語表現を検討してください。`,
                {
                    padding: locator.range(matchRange)
                }
            );
            report(paragraphNode, ruleError);
        }
    };

    return {
        async [Syntax.Document](node: any) {
            // ドキュメントの子ノードを順番にチェック
            for (const [i, currentNode] of node.children.entries()) {
                const nextNode = node.children[i + 1];

                // Paragraphノードの後にブロック要素が続く場合をチェック
                if (currentNode.type === Syntax.Paragraph) {
                    await checkColonContinuation(currentNode, nextNode);
                }
            }
        }
    };
};

export default rule;
