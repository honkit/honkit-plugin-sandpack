import { SandboxEnvironment, Sandpack, SandpackPredefinedTemplate, SandpackSetup } from "@codesandbox/sandpack-react";
import React from "react";
import { createRoot } from "react-dom/client";
import { parseCommentAsSandboxOptions } from "./parse-comment-as-sandbox-options";
import { t } from "./localize";
import type { SandboxInfo } from "@codesandbox/sandpack-client";

// Based: SandboxInfo
export type SandboxOptions = {
    files: Record<
        string,
        {
            code: string;
            readOnly?: boolean;
        } & {
            // prepend code snippet
            prependCode?: string;
            // load the path and fill code with it
            // this path is based on the markdown file path
            path?: string;
            // append code snippet
            appendCode?: string;
        }
    >;
    dependencies?: SandboxInfo["dependencies"];
    devDependencies?: SandboxInfo["devDependencies"];
    entry?: string;
    environment?: SandboxEnvironment;
    /**
     * What template we use, if not defined we infer the template from the dependencies or files.
     */
    template?: string;
    options?: Record<string, any>; // Refer SandpackInternalProps
    honkitSettings?: {
        isOpen: boolean; // false by default
        hideExitButton: boolean; // false by default
        hideRunButton: boolean; // false by default
    };
};

export const attachToElement = (element: HTMLElement | ChildNode, options: SandboxOptions) => {
    let currentRoot: ReturnType<typeof createRoot> | null;
    let containerElement: HTMLDivElement | null = null;
    const insert = (node: HTMLElement) => {
        if (element.nextSibling === null) {
            element.parentElement?.appendChild(node);
        } else {
            element.parentElement?.insertBefore(node, element.nextSibling);
        }
    };

    const exitButton = document.createElement("button");
    exitButton.className = "honkit-plugin-sandpack--exitButton";
    exitButton.textContent = t("exit_console");
    exitButton.setAttribute(
        "style",
        `
    display: inline-block;
    margin: 0.75em 0.25em;
    font-size: 0.9em;
    border: 0 none;
    border-radius: 3px;
    padding: 0.25em 1em;
    color: white;
    background-color: red;
`
    );
    exitButton.addEventListener("click", () => exit());
    const runButton = document.createElement("button");
    runButton.className = "honkit-plugin-sandpack--runButton";
    runButton.textContent = t("run_console");
    runButton.setAttribute(
        "style",
        `
    display: inline-block;
    margin: 0.75em 0.25em;
    font-size: 0.9em;
    border: 0 none;
    border-radius: 3px;
    padding: 0.25em 1em;
    color: white;
    background-color: #5cb85c;
`
    );

    runButton.addEventListener("click", () => enter());
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "honkit-plugin-sandpack--buttonContainer";
    if (!options.honkitSettings?.hideRunButton) {
        buttonContainer.append(runButton);
    }
    if (!options.honkitSettings?.hideExitButton) {
        buttonContainer.append(exitButton);
    }
    insert(buttonContainer);

    const enter = () => {
        const files = {
            // Workaround: https://github.com/codesandbox/sandpack/issues/373
            "/src/index.js": {
                code: "",
                hidden: true
            },
            ...options.files
        };
        containerElement = document.createElement("div");
        containerElement.classList.add("honkit-plugin-sandpack");
        buttonContainer.parentElement?.insertBefore(containerElement, buttonContainer.nextSibling);
        currentRoot = createRoot(containerElement);
        const setup: SandpackSetup = {
            entry: options.entry,
            dependencies: options.dependencies,
            devDependencies: options.devDependencies,
            environment: options.environment ?? "parcel"
        };
        const entry = options.entry;
        const sandpackOptions = options.options;
        const template = (options.template ?? "vanilla") as SandpackPredefinedTemplate;
        currentRoot.render(
            <Sandpack
                files={files}
                customSetup={setup}
                options={{
                    startRoute: entry,
                    skipEval: false,
                    autorun: true,
                    ...sandpackOptions
                }}
                template={template}
            />
        );

        runButton.style.display = "none";
        exitButton.style.display = "";
    };
    const exit = () => {
        currentRoot?.unmount();
        containerElement?.remove();
        currentRoot = null;
        containerElement = null;
        runButton.style.display = "";
        exitButton.style.display = "none";
    };
    const isOpen = options.honkitSettings?.isOpen ?? false;
    if (isOpen) {
        enter();
    } else {
        exit();
    }
};

function findComments(element: Element | Document | ChildNode) {
    const arr = [];
    for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === 8) {
            arr.push(node);
        } else {
            arr.push.apply(arr, findComments(node));
        }
    }
    return arr;
}

function updateCodeBlocs() {
    const getCommentNextPreNode = function (
        prevNode: Element | null,
        nextNode: Element | null,
        nextNextNode: Element | null
    ) {
        if (prevNode && prevNode.nodeName === "PRE") {
            return prevNode;
        }
        if (nextNode && nextNode.nodeName === "PRE") {
            return nextNode;
        } else if (nextNextNode && nextNextNode.nodeName === "PRE") {
            // some plugin fallback
            // for https://github.com/azu/gitbook-plugin-include-codeblock
            return nextNextNode;
        }
        return null;
    };
    // <!-- sandpack:{...} -->
    {
        const commentNodes = findComments(document);
        commentNodes
            .filter((commentNode) => {
                return commentNode?.textContent?.trim().startsWith("sandpack:");
            })
            .map((commentNode) => {
                return {
                    commentNode,
                    options: parseCommentAsSandboxOptions(commentNode?.textContent?.trim()!)
                };
            })
            .forEach(({ commentNode, options }) => {
                const targetNode = commentNode as HTMLElement | null;
                if (!targetNode) {
                    return;
                }
                const prevNode = targetNode.previousElementSibling;
                const nextNode = targetNode.nextElementSibling;
                const nextNextNode = nextNode && nextNode.nextElementSibling;
                const replaceNode = getCommentNextPreNode(prevNode, nextNode, nextNextNode);
                if (replaceNode) {
                    // append editor after pre/code
                    attachToElement(replaceNode, options);
                } else {
                    // replace comment with the editor
                    attachToElement(commentNode, options);
                }
            });
    }
}

// @ts-expect-error: with global
window.gitbook.events.bind("page.change", function () {
    updateCodeBlocs();
});
