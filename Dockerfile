# ========== 阶段一：构建 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 先只拷依赖清单，安装依赖
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# 再拷源码，执行构建
COPY . .
RUN pnpm run builds

# ========== 阶段二：运行 ==========
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
