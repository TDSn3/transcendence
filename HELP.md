# help

If the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension encounters a parsing error with `tsconfig.json`, add a `.vscode/settings.json` file to the project root:
``` json
{
    "eslint.workingDirectories": [
        "path/to/.eslintrc",
        "path/to/.eslintrc"
    ]
}
```
