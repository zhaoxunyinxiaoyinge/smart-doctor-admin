// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = () => {
    return {
        plugins: {
            'postcss-pxtorem': {
                rootValue: 16,
                propList: ['*'],
            }
        },
    }
}

