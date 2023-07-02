
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import topLevelAwait from 'vite-plugin-top-level-await'

import { viteMockServe } from 'vite-plugin-mock'

import viteCompression from 'vite-plugin-compression'

import Components from "unplugin-vue-components/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";

import eslintPlugin from "vite-plugin-eslint";

import { createHtmlPlugin } from 'vite-plugin-html'
import externalGlobals from "rollup-plugin-external-globals";

// 提供对旧版浏览器的支持
import legacy from "@vitejs/plugin-legacy"

import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {

  if (command === "serve") {
    return {
      test: {
        globals: true,
        environment: "jsdom"
      },
      base: './',
      plugins: [
        legacy({
          targets: ['defaults', 'not IE 11']
        }),
        Components({
          // resolvers: [ElementPlusResolver()],
        }),
        vueJsx(),
        AutoImport({
          imports: ["vue", 'vue-router'],
          dts: "src/auto-imports.d.ts",
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
        vue(),
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
        }),
        // viteMockServe({
        //   // default
        //   mockPath: "mock",
        //   supportTs: true,
        //   localEnabled: command === 'serve',
        // }),
        // eslintPlugin()
      ],

      // 对css module提供支持
      css: {
        modules: {
          scopeBehaviour: "local",
        },
        preprocessorOptions: {
          // 设置scss 的全局变量。全局引入css 文件
          scss: {
            additionalData: `$color:blue;`,
          }
        }
      },

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
      server: {
        open: true,
        port: 8080,
        proxy: {
          "^/api": {
            target: 'http://127.0.0.1:8081',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      }

    }
  } else {
    return {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "src"),
        },
      },

      plugins: [
        createHtmlPlugin({
          template: './index.html',
          inject: {
            tags: [
              {
                injectTo: 'body',
                tag: 'script',
                attrs: {
                  src: 'https://lib.baomitu.com/vue/3.2.47/vue.esm-browser.prod.js',
                  defer: true
                }
              },
              {
                injectTo: 'body',
                tag: 'script',
                attrs: {
                  src: 'https://lib.baomitu.com/vue-router/4.1.6/vue-router.cjs.js',
                  defer: true
                }
              },
              {
                injectTo: 'body',
                tag: 'script',
                attrs: {
                  src: 'https://lib.baomitu.com/axios/0.27.2/axios.js',
                  defer: true
                }
              },
              {
                injectTo: 'body',
                tag: 'script',
                attrs: {
                  src: 'https://lib.baomitu.com/js-cookie/latest/js.cookie.min.js',
                  defer: true
                }
              },

              {
                injectTo: 'body',
                tag: 'script',
                attrs: {
                  src: '//unpkg.com/element-plus',
                  defer: true
                }
              },
              
              {
                injectTo: 'head',
                tag: 'link',
                attrs: {
                 href: 'https://lib.baomitu.com/element-plus/latest/index.css',
                  defer: true
                }
              },
           ]
          }
        }),
        topLevelAwait({
          // The export name of top-level await promise for each chunk module
          promiseExportName: '__tla',
          // The function to generate import names of top-level await promise in each chunk module
          promiseImportName: i => `__tla_${i}`
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
      ],

      define: {
        "process.env": {
          NODE_ENV: 'production'
        }
      },
      build: {
        // target: {
        //   module: 'modules',
        // },
        // 打包分类
        rollupOptions: {
          external: ["vue", "vue-router", "axios", "element-plus", "js-cookie"],
          output: {
            chunkFileNames: 'static/js/[name]-[hash].js',
            entryFileNames: 'static/js/[name]-[hash].js',
            assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          },
          plugins: [
            externalGlobals({
              vue: "vue",
              "vue-router": 'vue-router',
              axios: 'axios',
              "js-cookie": "Cookies",
              "element-plus": "elementPlus"
            })
          ]
        },
        minify: "terser",
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
