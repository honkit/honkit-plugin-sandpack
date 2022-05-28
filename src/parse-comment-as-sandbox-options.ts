/**
 * <!-- sandpack:{/ Sandpack Options /} -->
 * @param {string} comment
 */
import { SandboxOptions } from "./sandpack";

export function parseCommentAsSandboxOptions(comment: string): SandboxOptions {
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
                .split("\\\\u003c\\\\u0021\\\\u002d\\\\u002d")
                .join("<!--")
                .split("\\\\u002d\\\\u002d\\\\u003e")
                .join("-->")
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
