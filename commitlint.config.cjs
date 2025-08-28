module.exports = {
    extends: [
        '@commitlint/config-conventional' // scoped packages are not prefixed
    ],
    rules: {
        'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert']],
        
    }
}