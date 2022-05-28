import { parseComment } from "./parse-comment";
import * as fs from "fs";
import path from "path";
import { SandboxOptions } from "./sandpack";

const escapeHTMLComment = (content: string) => {
    // It will be restored when parsing comment
    return content.replaceAll("<!--", "\\u003c\\u0021\\u002d\\u002d").replaceAll("-->", "\\u002d\\u002d\\u003e");
};
export const inlineFiles = (content: string, filePath: string) => {
    const baseDir = path.dirname(filePath);
    const commentPattern = /<!--\s?(sandpack:{[\s\S]*?})\s?-->/g;
    return content.replace(commentPattern, (_, match) => {
        const options = parseComment(match.trim());
        const inlinedFiles = Object.fromEntries(
            Object.entries(options.files).map((entry) => {
                const fileName = entry[0];
                const {
                    prependCode,
                    path: importPath,
                    appendCode,
                    ...originalProps
                } = entry[1] as SandboxOptions["files"][1];

                const loadedCode = importPath
                    ? escapeHTMLComment(fs.readFileSync(path.resolve(baseDir, importPath), "utf-8"))
                    : originalProps.code;
                const code = (prependCode ?? "") + loadedCode + (appendCode ?? "");
                return [
                    fileName,
                    {
                        ...originalProps,
                        code
                    }
                ];
            })
        );
        const updatedOptions = {
            ...inlinedFiles,
            files: inlinedFiles
        };
        return `<!-- sandpack:${JSON.stringify(updatedOptions)} -->`;
    });
};
