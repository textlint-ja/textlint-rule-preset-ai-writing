import { matchPatterns } from "@textlint/regexp-string-matcher";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";

type Options = {
    // If node's text includes allowed patterns, does not report.
    // Can be string or RegExp-like string ("/pattern/flags")
    allows?: string[];
};

const rule: TextlintRuleModule<Options> = (context: TextlintRuleContext, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];

    // Pattern to detect numbering at the beginning of headings
    // Matches patterns like: "1. ", "2. ", "3.1. ", "1) ", etc.
    const numberingPattern = /^\s*(\d+(?:\.\d+)*[.)]\s+)/;

    return {
        [Syntax.Header](node) {
            // Use raw text which includes the heading marker (#)
            const text = node.raw || getSource(node);

            // Check if text matches any allowed patterns
            if (allows.length > 0) {
                const matches = matchPatterns(text, allows);
                if (matches.length > 0) {
                    return;
                }
            }

            // For raw text, we need to skip the heading marker first
            // Extract just the heading content (after # and space)
            const headingContentMatch = text.match(/^#{1,6}\s+(.+)$/);
            const headingContent = headingContentMatch ? headingContentMatch[1] : text;

            const match = headingContent.match(numberingPattern);
            if (match) {
                const numberPart = match[1];
                const matchStart = match.index ?? 0;
                const matchEnd = matchStart + numberPart.length;

                report(
                    node,
                    new RuleError(
                        "見出しに連番を含めるパターンは機械的な印象を与える可能性があります。連番の必要性を検討してみてください。",
                        {
                            padding: locator.range([matchStart, matchEnd])
                        }
                    )
                );
            }
        }
    };
};

export default rule;
