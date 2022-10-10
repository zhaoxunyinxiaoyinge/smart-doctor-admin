import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import { viteMockServe } from 'vite-plugin-mock'

import viteCompression from 'vite-plugin-compression'

import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";

// 提供对旧版浏览器的支持
import legacy from "@vitejs/plugin-legacy"

import path from "path"
import { serve } from 'esbuild';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild })=>{
   if(command==="serve"){
    const prodMock=true;
    return {
      base: '/',
      plugins: [
        legacy({
          targets: ['defaults', 'not IE 11']
        }),
        Components({
          // resolvers: [ElementPlusResolver()],
        }),
        vueJsx(),
        AutoImport({
          // resolvers: [ElementPlusResolver()],
          imports: ["vue", 'vue-router'],
          dts: "src/auto-imports.d.ts",
        }),
        createSvgIconsPlugin({
          // Specify the icon folder to be cached
          iconDirs: [path.resolve(process.cwd(), 'src/icons')],
          // Specify symbolId format
          symbolId: 'icon-[dir]-[name]',
    
          /**
           * custom dom id
           * @default: __svg__icons__dom__
           */
          customDomId: '__svg__icons__dom__',
        }),
        vue(),
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        }),
        viteMockServe({
          // default
          mockPath: "mock",
          supportTs: true ,
          localEnabled:command === 'serve',
        })
      ],
    
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      
      },
      define: {
        "process.env": {
          NODE_ENV: 'development'
        }
      },
    }
   }else{
    return {
      define: {
        "process.env": {
          NODE_ENV: 'production'
        }
      },
      build: {
        // 打包分类
        rollupOptions: {
          output: {
            chunkFileNames: 'static/js/[name]-[hash].js',
            entryFileNames: 'static/js/[name]-[hash].js',
            assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          }
        },
        terserOptions: {
          compress: {
            // keep_infinity: true,//chrome性能优化
            drop_console: true//删除console
          },
          // toplevel: true
        }
      }
    }
   } 
})
