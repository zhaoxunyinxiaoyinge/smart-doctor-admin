
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import viteCompression from 'vite-plugin-compression'
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from "path";

export default defineConfig(({ command,mode}) => {
  if (command === "serve") {
    return {
      cacheDir:
        process.env.VITE_CACHE_DIR ||
        path.resolve(process.cwd(), "..", ".vite-cache-admin"),
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
            ElementPlusResolver(),
          ],
          imports: ["vue", 'vue-router',"pinia"],
          dts: true,
          eslintrc: {
            enabled: true,
            filepath: './.eslintrc-auto-import.json',
            globalsPropValue: true,
          }
        }),
        Components({
      resolvers: [ElementPlusResolver()],
    }),
        createSvgIconsPlugin({
          iconDirs: [path.resolve(process.cwd(), 'src/icons')],
          symbolId: 'icon-[dir]-[name]',
          customDomId: '__svg__icons__dom__',
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],

      css: {
        modules: {
          scopeBehaviour: "local",
        },
        preprocessorOptions: {
          scss: {
            additionalData: `@use "/src/assets/css/var.scss" as *;`,
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
            target:loadEnv(mode,"./").VITE_API_URL+"/api" || "http://localhost:7001",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
          "^/sapi2": {
            target:loadEnv(mode,"./").VITE_API_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/sapi2/, '')
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
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
      base:"/",
      // 与开发环境保持一致：注入 Element Plus 主题变量，
      // 使生产构建期的主色色阶即为品牌色，避免首屏出现默认蓝的过渡帧。
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use "/src/assets/css/var.scss" as *;`,
            api: "modern-compiler",
          }
        }
      },
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
