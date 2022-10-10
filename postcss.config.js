const postcssPresetEnv=require('postcss-preset-env')//处理css降级

module.exports= ()=>{
    return {
        plugins:[postcssPresetEnv()],
        extensions: ['.css'],
        use: {
            sass: null,
            stylus: null,
        },
    }  
}