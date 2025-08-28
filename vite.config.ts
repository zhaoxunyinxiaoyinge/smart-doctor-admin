
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// import { viteMockServe } from 'vite-plugin-mock'

import viteCompression from 'vite-plugin-compression'
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// import eslintPlugin from "vite-plugin-eslint";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command,mode}) => {
  if (command === "serve") {
    return {
      test: {
        globals: true,
        environment: "jsdom",
      },
      base: './',
      warmup: {
        clientFiles: [
          "./src/perssion.ts"
        ]
      },
      plugins: [
        vue(),
        vueJsx(),
        AutoImport({
          resolvers: [
            // auto import element plus components
            ElementPlusResolver(),
          ],
          imports: ["vue", 'vue-router'],
          dts: true,
          eslintrc: {
            enabled: false,
            filepath: './.eslintrc-auto-import.json',
            globalsPropValue: true,
          }
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
        // viteMockServe({
        //   // default
        //   mockPath: "mock",
        //   supportTs: true,
        //   localEnabled: command === 'serve',
        // }),
        // eslintPlugin()

        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],

      // 对css module提供支持
      css: {
        modules: {
          scopeBehaviour: "local",
        },
        preprocessorOptions: {
          // 设置scss 的全局变量。全局引入css 文件
          scss: {
            additionalData: `@use "/src/assets/element/var.scss" as *;`,
            api: "modern-compiler",
          }
        }
      },
      optimizeDeps: {
        include: [
          "vue",
          "vue-router",
          "axios",
          "element-plus",
          "js-cookie"
        ]
      },

      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },

      define: {
        process: {
          env:{
            NODE_ENV:mode,
            VITE_API_URL: JSON.stringify(loadEnv(mode, "./").VITE_API_URL || "http://localhost:3000"),
            VITE_PORT: JSON.stringify(loadEnv(mode, "./").VITE_PORT || 3000)
          }
        }
      },
      server: {
        open: true,
        port:parseInt(loadEnv(mode,"./").VITE_PORT) || 3000,
        proxy: {
          "^/api": {
            target:loadEnv(mode,"./").VITE_API_URL || "http://localhost:3000",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      },
    }
  } else {
    return {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },
      plugins: [
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
         vueJsx(),
        AutoImport({
          resolvers: [
            // auto import element plus components
            ElementPlusResolver(),
          ],
          imports: ["vue", 'vue-router'],
        }),
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        }),
      ],
      base:"/",
      build: {
        sourcemap:false,
        target:"es2022",
        // 打包分类
        rollupOptions: {
          // external: ["vue", "vue-router", "axios", "element-plus", "js-cookie"],
          output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[hash].js',
            assetFileNames: (chunkInfo) => {
                const extName=chunkInfo.name?.split('.').pop();
                if(extName){
                  if(extName=='svg'||extName=='png'||extName=='gif'){
                    return `img/[name]-[hash].[ext]`;
                  }
                  if(['css','scss'].includes(extName)){
                    return `css/[name]-[hash].[ext]`;
                  }
                }
                return `[ext]/[name]-[hash].[ext]`;
            }
          }
        },
        // minify: "terser",
        terserOptions: {
          compress: {
            // keep_infinity: true,//chrome性能优化
            drop_console: true//删除console
          },
        }
      }
    }
  }
})
