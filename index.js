// LICENSE : MIT
"use strict";
const { inlineFiles } = require("./lib/hook-inline.js");
module.exports = {
    book: {
        assets: "./assets",
        js: ["honkit-plugin-sandpack.js"]
    },
    hooks: {
        "page:before": function (page) {
            if (!page.content || !page.rawPath) {
                return page;
            }
            page.content = inlineFiles(page.content, page.rawPath);
            return page;
        }
    }
};
