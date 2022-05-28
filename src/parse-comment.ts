import type { SandboxInfo } from "@codesandbox/sandpack-client";

export type { SandboxInfo };

/**
 * <!-- sandpack:{/ Sandpack Options /} -->
 * @param {string} comment
 */
export function parseComment(comment: string): SandboxInfo {
    const CONSOLE_METADATA = /sandpack:({[\s\S]+})$/;
    const optionString = comment.match(CONSOLE_METADATA);
    if (!optionString) {
        throw new Error(`Does not match sandpack comment.
sandpack:{ ... } should be json string.
Actual: ${comment}
`);
    }
    try {
        const json = JSON.parse(
            optionString[1]
                .replaceAll("\\\\u003c\\\\u0021\\\\u002d\\\\u002d", "<!--")
                .replaceAll("\\\\u002d\\\\u002d\\\\u003e", "-->")
        );
        return {
            ...json
        };
    } catch (error: any) {
        throw new Error(`Can not parsed the metadata.
sandpack:{ ... } should be json string.
Actual: ${comment}
Error: ${error.message}
`);
    }
}
