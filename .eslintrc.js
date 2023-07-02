module.exports = {
    // 设置代码运行的环境
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended",
        'plugin:vue/vue3-recommended',
        "./.eslintrc-auto-import.json"
    ],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module",
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        "vue/no-v-model-argument": "off",
        "vue/no-multiple-template-root":0,
        "vue/multi-word-component-names": "off",
        "@typescript-eslint/ban-types": [
            "error",
            {
                "extendDefaults": true,
                "types": {
                    "{}": false,
                }
            }
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        "@typescript-eslint/no-explicit-any": ["off"],
        "space-before-function-paren": 0,
        "vue/no-v-for-template-key": 0,
        "vue/comment-directive": "off",
        "vue/valid-v-on": "off"

    }
}
