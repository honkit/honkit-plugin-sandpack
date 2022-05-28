# Introduction

<style>
.markdown-section {
    overflow: initial!important
}
.honkit-plugin-sandpack {
    width: calc(100% + 200px);
    margin: 0 0 0 -100px;
    background: #EECE34;
}
</style>

This is example.

<!-- sandpack:{
  "files": {
    "/src/index.js": {
      "path": "example1/index.js"
    },
    "/index.html": {
      "path": "example1/index.html"
    }
  },
  "entry": "/index.html",
  "dependencies": {
    "uuid": "latest"
  }
} -->
```js
document.querySelector("h1").style.color = "red";
```

This is complex example.

<!-- sandpack:{
  "files": {
    "/src/index.js": {
      "prependCode": "import '/src/index.css'; // Hack to load index.css\n",
      "path": "example2/src/index.js"
    },
    "/src/App.js": {
      "path": "example2/src/App.js",
      "active": true
    },
    "/src/index.css": {
      "path": "example2/src/index.css",
      "hidden": true
    },
    "/index.html": {
      "path": "example2/index.html"
    }
  },
  "entry": "/index.html"
} -->
```js
// Todo App
```
