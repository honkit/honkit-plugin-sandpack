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
        const json = JSON.parse(optionString[1]);
        return {
            ...json
        };
    } catch (error) {
        throw new Error(`Can not parsed the metadata.
sandpack:{ ... } should be json string.
Actual: ${comment}
`);
    }
}
