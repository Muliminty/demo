---
title: 'Markdown 样式指南'
description: '这里是一些在 Astro 中编写 Markdown 内容时可以使用的基本 Markdown 语法示例。'
pubDate: 'Jun 19 2024'
heroImage: '/blog-placeholder-1.jpg'
---

这里是一些在 Astro 中编写 Markdown 内容时可以使用的基本 Markdown 语法示例。

## 标题

以下 HTML `<h1>`—`<h6>` 元素代表六个级别的章节标题。`<h1>` 是最高的章节级别，而 `<h6>` 是最低的。

# H1

## H2

### H3

#### H4

##### H5

###### H6

## 段落

Xerum，谁会解释那些痛苦的人。与快乐相关的，带着快乐的态度，悲伤或痛苦，或者是那些想要获得快乐的人，他们在重新定位时感到痛苦，或者是那些寻找不正当利益的人？Quianimin 处理程序被选中，当与我们不满意的价值观一起时？Quiatem。Nam，omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus，sin conecerem erum fuga。Ri oditatquam，ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost，temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat。

Itatur？Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum，core et que aut hariosam ex eat。

## 图片

### 语法

```markdown
![Alt text](./full/or/relative/path/of/image)
```

### 输出

![blog placeholder](/blog-placeholder-about.jpg)

## 引用块

引用块元素表示引用自另一个来源的内容，可选地带有引用，引用必须在 `footer` 或 `cite` 元素内，并可选地带有内联更改，如注释和缩写。

### 不带归属的引用块

#### 语法

```markdown
> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **注意** 你可以在引用块内使用 _Markdown 语法_。
```

#### 输出

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.  
> **注意** 你可以在引用块内使用 _Markdown 语法_。

### 带归属的引用块

#### 语法

```markdown
> 不要通过共享内存来通信，而是通过通信来共享内存。<br>
> — <cite>Rob Pike[^1]</cite>
```

#### 输出

> 不要通过共享内存来通信，而是通过通信来共享内存。<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: 上述引用摘自 Rob Pike 在 2015 年 11 月 18 日 Gopherfest 期间的[演讲](https://www.youtube.com/watch?v=PAAkCSZUG1c)。

## 表格

### 语法

```markdown
| 斜体     | 粗体     | 代码   |
| --------- | -------- | ------ |
| _斜体_ | **粗体** | `代码` |
```

### 输出

| 斜体     | 粗体     | 代码   |
| --------- | -------- | ------ |
| _斜体_ | **粗体** | `代码` |

## 代码块

### 语法

我们可以在新行中使用 3 个反引号 ``` 并编写代码片段，然后在新行中用 3 个反引号关闭，为了突出特定语言的语法，在第一个 3 个反引号后写上语言名称，例如 html、javascript、css、markdown、typescript、txt、bash

````markdown
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```
````

### 输出

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

## 列表类型

### 有序列表

#### 语法

```markdown
1. 第一项
2. 第二项
3. 第三项
```

#### 输出

1. 第一项
2. 第二项
3. 第三项

### 无序列表

#### 语法

```markdown
- 列表项
- 另一项
- 再一项
```

#### 输出

- 列表项
- 另一项
- 再一项

### 嵌套列表

#### 语法

```markdown
- 水果
  - 苹果
  - 橙子
  - 香蕉
- 乳制品
  - 牛奶
  - 奶酪
```

#### 输出

- 水果
  - 苹果
  - 橙子
  - 香蕉
- 乳制品
  - 牛奶
  - 奶酪

## 其他元素 — abbr, sub, sup, kbd, mark

### 语法

```markdown
<abbr title="Graphics Interchange Format">GIF</abbr> 是一种位图图像格式。

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

按下 <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> 结束会话。

大多数<mark>蝙蝠</mark>是夜行性动物。
```

### 输出

<abbr title="Graphics Interchange Format">GIF</abbr> 是一种位图图像格式。

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

按下 <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>Delete</kbd> 结束会话。

大多数<mark>蝙蝠</mark>是夜行性动物。
