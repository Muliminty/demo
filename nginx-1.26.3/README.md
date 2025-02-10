以下是为您整理的 Nginx 使用文档（Windows 版）：

---

# Nginx 使用文档

## 目录
1. [基础操作](#基础操作)
2. [配置文件说明](#配置文件说明)
3. [常用场景配置](#常用场景配置)
4. [日志管理](#日志管理)
5. [安全建议](#安全建议)
6. [常见问题](#常见问题)

---

## 基础操作

### 1. 启动 Nginx
- **图形化启动**  
  双击 `nginx.exe`（位于 Nginx 根目录）

- **命令行启动**  
  ```bash
  start nginx
  ```

### 2. 停止 Nginx
```bash
nginx -s stop      # 强制立即停止
nginx -s quit      # 优雅停止（等待处理完当前请求）
```

### 3. 重载配置
```bash
nginx -s reload    # 重新加载配置（无需停止服务）
```

### 4. 验证配置
```bash
nginx -t          # 检查配置文件语法是否正确
```

---

## 配置文件说明
配置文件路径：`conf/nginx.conf`

### 核心结构
```nginx
events {
    worker_connections 1024; # 单个工作进程最大连接数
}

http {
    server {
        listen 80;          # 监听端口
        server_name localhost; # 域名

        location / {
            root   html;    # 网站根目录
            index  index.html;
        }
    }
}
```

---

## 常用场景配置

### 1. 静态网站
```nginx
server {
    listen 80;
    server_name mysite.com;
    
    location / {
        root   D:/web/html;
        index  index.html;
    }
}
```

### 2. 反向代理
```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

### 3. 负载均衡
```nginx
upstream backend {
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
}

server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://backend;
    }
}
```

### 4. HTTPS 配置
```nginx
server {
    listen 443 ssl;
    server_name secure.example.com;

    ssl_certificate      cert/server.crt;
    ssl_certificate_key  cert/server.key;

    location / {
        root   html;
        index  index.html;
    }
}
```

---

## 日志管理
- **访问日志**：`logs/access.log`
- **错误日志**：`logs/error.log`

### 日志切割
1. 重命名日志文件
2. 执行命令生成新日志：
   ```bash
   nginx -s reopen
   ```

---

## 安全建议
1. 定期更新 Nginx 版本
2. 删除默认欢迎页
3. 配置防火墙规则
4. 避免使用 root 权限运行
5. 配置 SSL 使用 TLS 1.2/1.3

---

## 常见问题

### Q1: 端口被占用怎么办？
```bash
netstat -ano | findstr :80
taskkill /PID <PID> /F
```

### Q2: 修改配置后不生效？
- 检查语法：`nginx -t`
- 重载配置：`nginx -s reload`

### Q3: 如何查看运行状态？
```bash
tasklist /fi "imagename eq nginx.exe"
```

---

> **提示**：所有命令需在 Nginx 根目录下执行，或将 Nginx 加入系统环境变量。
