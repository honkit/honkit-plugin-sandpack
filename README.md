# honkit-plugin-sandpack

A HonKit plugin for [Sandpack](https://sandpack.codesandbox.io/docs/).

## Installation

    npm install honkit-plugin-sandpack

## Usage

Via `book.json`:

```json
{
  "plugins": [
    "sandpack"
  ]
}
```

Integration code with HTML comments.

    <!-- sandpack:{
      "files": {
        "/src/index.js": {
          "path": "src/index.js"
        },
        "/index.html": {
          "path": "src/index.html"
        }
      },
      "entry": "/src/index.js",
      "dependencies": {
        "uuid": "latest"
      }
    } -->
    ```js
    const test = 1
    ```

For more details, See [example](public/)

## Tests

- [ ] Write How to Tests

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
