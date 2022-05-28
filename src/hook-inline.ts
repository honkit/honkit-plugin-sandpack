import { parseComment } from "./parse-comment";
import type { SandpackBundlerFile } from "@codesandbox/sandpack-client/dist/types/types";
import * as fs from "fs";
import path from "path";

export const inlineFiles = (content: string, filePath: string) => {
    const baseDir = path.dirname(filePath);
    const commentPattern = /<!--\s?(sandpack:{[\s\S]+})\s?-->/g;
    console.log({
        content,
        baseDir
    });
    return content.replace(commentPattern, (_, match) => {
        const options = parseComment(match.trim());
        console.log({
            options
        });
        const inlinedFiles = Object.fromEntries(
            Object.entries(options.files).map((entry) => {
                const fileName = entry[0];
                const fileBufferFile = entry[1] as SandpackBundlerFile & {
                    path?: string;
                };
                if (!fileBufferFile.path) {
                    return entry;
                }
                const code = fs.readFileSync(path.resolve(baseDir, fileBufferFile.path), "utf-8");
                return [
                    fileName,
                    {
                        ...fileBufferFile,
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
