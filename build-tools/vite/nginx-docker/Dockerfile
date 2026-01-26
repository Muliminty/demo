   # 使用完整 Node.js 镜像
   FROM node:22.11.0 AS builder
   WORKDIR /app

   # 复制 package.json 和 package-lock.json（如果有的话）
   COPY package*.json ./

   RUN npm config rm proxy \
       && npm config rm https-proxy \
       && npm config set registry https://registry.npmmirror.com \
       && npm cache clean -force \
       && npm install

   # 复制剩余文件并构建
   COPY . .
   RUN npm run build

   # 使用 Nginx 作为 Web 服务器
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf

   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]