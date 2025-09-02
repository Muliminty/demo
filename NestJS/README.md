# 🚀 NestJS 快速入门

NestJS 是一个基于 **TypeScript** 的渐进式 Node.js 框架，底层基于 **Express**（也可切换为 Fastify），适合构建高可维护性、可扩展的服务端应用。

---

## 1. 安装环境

需要：

* Node.js >= 16
* npm / yarn / pnpm
  建议用 **pnpm**，速度快、依赖干净。

```bash
npm i -g @nestjs/cli
# 或
yarn global add @nestjs/cli
# 或
pnpm add -g @nestjs/cli
```

---

## 2. 创建项目

```bash
nest new my-project
```

会提示你选择包管理工具（推荐 pnpm）。

进入项目目录：

```bash
cd my-project
pnpm run start:dev
```

访问：
👉 [http://localhost:3000/](http://localhost:3000/)
你会看到默认返回 `Hello World!`。

---

## 3. 核心概念

NestJS 有几个核心概念（和 Angular 很像）：

* **Module** 模块：组织代码的基本单元。
* **Controller** 控制器：负责处理请求和返回响应。
* **Service** 服务：负责业务逻辑和数据处理。
* **Decorator 装饰器**：用来声明模块、控制器、方法等（如 `@Controller`、`@Get`）。

---

## 4. 新建 Controller

创建一个用户控制器：

```bash
nest generate controller users
```

代码（`users.controller.ts`）：

```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return ['Tom', 'Jerry', 'Alice'];
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, name: `User-${id}` };
  }
}
```

访问：

* [http://localhost:3000/users](http://localhost:3000/users)
* [http://localhost:3000/users/1](http://localhost:3000/users/1)

---

## 5. 新建 Service

```bash
nest generate service users
```

代码（`users.service.ts`）：

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = ['Tom', 'Jerry', 'Alice'];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return { id, name: this.users[id] || 'Unknown' };
  }
}
```

在 `users.controller.ts` 中注入使用：

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }
}
```

---

## 6. 常用功能

* **DTO（数据传输对象）**：用于参数校验（结合 `class-validator`）。
* **Pipe（管道）**：参数验证和转换。
* **Middleware（中间件）**：请求前处理。
* **Guard（守卫）**：权限验证。
* **Interceptor（拦截器）**：统一处理响应 / 日志。

---

## 7. 加个简单的 POST 示例

安装验证库：

```bash
pnpm add class-validator class-transformer
```

DTO：

```typescript
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;
}
```

Controller：

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto.name);
  }
}
```

Service：

```typescript
create(name: string) {
  this.users.push(name);
  return { success: true, name };
}
```

测试：

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob"}'
```

返回：

```json
{ "success": true, "name": "Bob" }
```

---

✅ 到这里，你已经跑通了一个 **完整的 NestJS 模块（Controller + Service + DTO）**。
后续可以继续学 **数据库（TypeORM/Prisma）**、**认证（JWT、Passport）**、**模块化拆分** 等。
