import type { TextlintRuleModule } from "@textlint/types";
import { matchPatterns } from "@textlint/regexp-string-matcher";
import { StringSource } from "textlint-util-to-string";

/**
 * テクニカルライティングガイドラインに基づく文書品質改善ルール
 *
 * 詳細なガイドラインについては以下を参照してください：
 * https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md
 */

export interface Options {
    // If node's text includes allowed patterns, does not report.
    // Can be string or RegExp-like string ("/pattern/flags")
    allows?: string[];
    // Disable specific categories of guidance
    disableRedundancyGuidance?: boolean;
    disableVoiceGuidance?: boolean;
    disableConsistencyGuidance?: boolean;
    disableClarityGuidance?: boolean;
    disableStructureGuidance?: boolean;
    // Enable document-level analysis
    enableDocumentAnalysis?: boolean;
}

const rule: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, report, locator } = context;
    const allows = options.allows ?? [];
    const disableRedundancyGuidance = options.disableRedundancyGuidance ?? false;
    const disableVoiceGuidance = options.disableVoiceGuidance ?? false;
    const disableConsistencyGuidance = options.disableConsistencyGuidance ?? false;
    const disableClarityGuidance = options.disableClarityGuidance ?? false;
    const disableStructureGuidance = options.disableStructureGuidance ?? false;
    const enableDocumentAnalysis = options.enableDocumentAnalysis ?? true;

    // テクニカルライティングガイダンスパターン
    // 1. 簡潔性の原則 (Conciseness) - 冗長表現の排除
    const redundancyGuidance = [
        {
            pattern: /まず最初に/g,
            message:
                "【簡潔性】冗長表現が検出されました。「まず最初に」→「まず」または「最初に」への簡潔化を検討してください。",
            category: "redundancy"
        },
        {
            pattern: /あらかじめ予測/g,
            message: "【簡潔性】冗長表現が検出されました。「あらかじめ予測」→「予測」への簡潔化を検討してください。",
            category: "redundancy"
        },
        {
            pattern: /することができます/g,
            message:
                "【簡潔性】冗長な助動詞表現が検出されました。「できます」または「します」への簡潔化を検討してください。",
            category: "redundancy"
        },
        {
            pattern: /する必要があります/g,
            message:
                "【簡潔性】冗長な義務表現が検出されました。「してください」または「します」への直接的な表現を検討してください。",
            category: "redundancy"
        },
        {
            pattern: /言うまでもなく/g,
            message: "【簡潔性】不要な前置き表現が検出されました。核心から始める簡潔な文章構成を検討してください。",
            category: "redundancy"
        }
    ];

    // 2. 明確性の原則 (Clarity) - 能動態と具体的な動詞
    const voiceGuidance = [
        {
            pattern: /が行われ(て|る|ます)/g,
            message:
                "【明確性】受動的で抽象的な表現が検出されました。具体的な動詞を使った能動態への変更を検討してください（例：「実行する」「処理する」）。",
            category: "voice"
        },
        {
            pattern: /の変更を行/g,
            message:
                "【明確性】名詞化された表現が検出されました。「を変更する」のような直接的な動詞表現を検討してください。",
            category: "voice"
        },
        {
            pattern: /の実装を実施/g,
            message: "【明確性】二重の名詞化表現が検出されました。「を実装する」への簡潔化を検討してください。",
            category: "voice"
        },
        {
            pattern: /によって[実行処理実施]され/g,
            message:
                "【明確性】受動態表現が検出されました。「○○が△△を実行する」のような能動態への変更を検討してください。",
            category: "voice"
        },
        {
            pattern: /がシステムによって実行される/g,
            message:
                "【明確性】受動態表現が検出されました。「システムが○○を実行する」のような能動態への変更を検討してください。",
            category: "voice"
        },
        {
            pattern: /によって実行され/g,
            message:
                "【明確性】受動態表現が検出されました。「システムが○○を実行する」のような能動態への変更を検討してください。",
            category: "voice"
        }
    ];

    // 3. 具体性の原則 (Concreteness) - 抽象的表現の具体化
    const clarityGuidance = [
        {
            pattern: /高速な(?:パフォーマンス|処理|動作)/g,
            message:
                "【具体性】抽象的な性能表現が検出されました。具体的な数値基準の提示を検討してください（例：「50ms未満の応答時間」）。",
            category: "clarity"
        },
        {
            pattern: /大幅に(?:向上|改善|削減)/g,
            message:
                "【具体性】定量化されていない変化表現が検出されました。具体的な数値や割合の提示を検討してください。",
            category: "clarity"
        },
        {
            pattern: /効率的な/g,
            message:
                "【具体性】抽象的な評価表現が検出されました。何に対してどのように効率的なのか、具体的な説明を検討してください。",
            category: "clarity"
        },
        {
            pattern: /適切な/g,
            message:
                "【具体性】曖昧な判断表現が検出されました。何を基準として適切なのか、具体的な条件や基準の明示を検討してください。",
            category: "clarity"
        },
        {
            pattern: /必要に応じて/g,
            message:
                "【具体性】曖昧な条件表現が検出されました。どのような状況で必要なのか、具体的な判断基準の明示を検討してください。",
            category: "clarity"
        }
    ];

    // 4. 一貫性の原則 (Consistency) - 用語と表現の統一
    const consistencyGuidance = [
        {
            pattern: /(ユーザー.*?(?:クライアント|顧客))|(?:(?:クライアント|顧客).*?ユーザー)/g,
            message:
                "【一貫性】同一対象を指す用語の混在が検出されました。文書全体で統一した用語の使用を検討してください。",
            category: "consistency"
        },
        {
            pattern: /(設定画面.*?(?:設定ページ|環境設定))|(?:(?:設定ページ|環境設定).*?設定画面)/g,
            message:
                "【一貫性】機能名称の表記揺れが検出されました。プロジェクト内で統一した名称の使用を検討してください。",
            category: "consistency"
        },
        {
            pattern: /(です。.*?である。)|(である。.*?です。)/g,
            message:
                "【一貫性】文体の混在が検出されました。「です・ます調」または「だ・である調」への統一を検討してください。",
            category: "consistency"
        }
    ];

    // 5. 構造化の原則 (Structure) - 情報の論理的整理
    const structureGuidance = [
        {
            pattern: /また、.*?また、/g,
            message: "【構造化】接続表現の重複が検出されました。箇条書きや段落分けによる情報整理を検討してください。",
            category: "structure"
        },
        {
            pattern: /(?:第一に|まず).*?(?:第二に|次に).*?(?:第三に|最後に)/g,
            message:
                "【構造化】連続的な手順説明が検出されました。番号付きリストまたは見出し構造での整理を検討してください。",
            category: "structure"
        }
    ];

    // 文書全体の品質評価指標
    let hasDocumentIssues = false;
    const documentQualityMetrics = {
        redundancy: 0,
        voice: 0,
        clarity: 0,
        consistency: 0,
        structure: 0
    };

    return {
        [Syntax.Paragraph](node) {
            // StringSourceを使用してコードブロックを除外したテキストを取得
            const source = new StringSource(node, {
                replacer({ node, emptyValue }) {
                    // コードブロック、インラインコードを除外
                    if (node.type === "Code" || node.type === "InlineCode") {
                        return emptyValue();
                    }
                    return undefined;
                }
            });
            const text = source.toString();

            // 許可パターンのチェック
            if (allows.length > 0) {
                const matches = matchPatterns(text, allows);
                if (matches.length > 0) {
                    return;
                }
            }

            // 各カテゴリのガイダンスを統合
            const allGuidancePatterns = [
                ...(disableRedundancyGuidance ? [] : redundancyGuidance),
                ...(disableVoiceGuidance ? [] : voiceGuidance),
                ...(disableClarityGuidance ? [] : clarityGuidance),
                ...(disableConsistencyGuidance ? [] : consistencyGuidance),
                ...(disableStructureGuidance ? [] : structureGuidance)
            ];

            for (const { pattern, message, category } of allGuidancePatterns) {
                const matches = text.matchAll(pattern);
                for (const match of matches) {
                    const index = match.index ?? 0;

                    // プレーンテキストの位置を元のノード内の位置に変換
                    const originalIndex = source.originalIndexFromIndex(index);
                    const originalEndIndex = source.originalIndexFromIndex(index + match[0].length);

                    if (originalIndex !== undefined && originalEndIndex !== undefined) {
                        const originalRange = [originalIndex, originalEndIndex] as const;

                        // カテゴリ別のメトリクスを更新
                        documentQualityMetrics[category as keyof typeof documentQualityMetrics]++;
                        hasDocumentIssues = true;

                        report(node, {
                            message: message,
                            padding: locator.range(originalRange)
                        });
                    }
                }
            }
        },
        [Syntax.DocumentExit](node) {
            // 文書全体の分析を実行（enableDocumentAnalysisがtrueの場合）
            if (enableDocumentAnalysis && hasDocumentIssues) {
                const totalIssues = Object.values(documentQualityMetrics).reduce((sum, count) => sum + count, 0);

                // カテゴリ別の詳細な分析結果を含むメッセージを生成
                const categoryDetails = [];
                if (documentQualityMetrics.redundancy > 0) {
                    categoryDetails.push(`簡潔性: ${documentQualityMetrics.redundancy}件`);
                }
                if (documentQualityMetrics.voice > 0) {
                    categoryDetails.push(`明確性: ${documentQualityMetrics.voice}件`);
                }
                if (documentQualityMetrics.clarity > 0) {
                    categoryDetails.push(`具体性: ${documentQualityMetrics.clarity}件`);
                }
                if (documentQualityMetrics.consistency > 0) {
                    categoryDetails.push(`一貫性: ${documentQualityMetrics.consistency}件`);
                }
                if (documentQualityMetrics.structure > 0) {
                    categoryDetails.push(`構造化: ${documentQualityMetrics.structure}件`);
                }

                const detailsText = categoryDetails.length > 0 ? ` [内訳: ${categoryDetails.join(", ")}]` : "";

                report(node, {
                    message: `【テクニカルライティング品質分析】この文書で${totalIssues}件の改善提案が見つかりました${detailsText}。効果的なテクニカルライティングの7つのC（Clear, Concise, Correct, Coherent, Concrete, Complete, Courteous）の原則に基づいて見直しを検討してください。詳細なガイドライン: https://github.com/textlint-ja/textlint-rule-preset-ai-writing/blob/main/docs/tech-writing-guidelines.md`
                });
            }
        }
    };
};

export default rule;
