# Git 提交记录爬取脚本使用说明

这个脚本用于自动获取多个项目当天的 Git 提交记录，并按照指定格式输出。

## 文件说明

- `fetch_daily_commits.py` - Python 版本脚本（推荐）
- `fetch_daily_commits.sh` - Shell 版本脚本
- `projects_config.json` - 项目配置文件
- `自动化 git 记录脚本.md` - 输出文件（参考格式）

## 使用方法

### 方法一：使用配置文件（推荐）

1. **编辑配置文件 `projects_config.json`**：
```json
{
  "projects": {
    "项目A": "/实际路径/to/project-a",
    "项目B": "/实际路径/to/project-b",
    "项目C": "/实际路径/to/project-c"
  },
  "output_file": "自动化 git 记录脚本.md"
}
```

2. **运行脚本**：
```bash
python3 fetch_daily_commits.py
```

### 方法二：使用命令行参数

```bash
# 指定项目和路径
python3 fetch_daily_commits.py 项目A:/path/to/project-a 项目B:/path/to/project-b

# 指定配置文件
python3 fetch_daily_commits.py --config=my_config.json

# 指定输出文件
python3 fetch_daily_commits.py --output=my_output.md
```

### 方法三：使用 Shell 脚本

1. **编辑 `fetch_daily_commits.sh`**，修改项目路径：
```bash
declare -A PROJECTS=(
    ["项目A"]="/实际路径/to/project-a"
    ["项目B"]="/实际路径/to/project-b"
    ["项目C"]="/实际路径/to/project-c"
)
```

2. **添加执行权限并运行**：
```bash
chmod +x fetch_daily_commits.sh
./fetch_daily_commits.sh
```

## 输出格式

脚本会生成如下格式的输出：

```markdown
## 2026-02-11
```
- feat: 增强文章组件点击处理，以便导航至新闻详情

- refactor: 删除 log

- feat: 添加构建和压缩脚本，支持多环境构建

- feat: 添加股票中性状态样式并优化股票报价显示逻辑
  - 在 StyleConfig 组件中添加了股票中性状态的样式配置
  - 优化了股票报价的显示逻辑，确保正确显示价格变化

```
```

## 功能特点

1. **自动获取当天提交**：只获取当天的提交记录（00:00:00 - 23:59:59）
2. **多项目支持**：可以同时处理多个项目
3. **自动更新**：如果输出文件已存在今天的记录，会自动替换
4. **格式统一**：按照参考文件的格式输出
5. **错误处理**：自动跳过不存在的路径或非 Git 仓库

## 注意事项

1. 确保所有项目路径都是有效的 Git 仓库
2. 确保有读取这些 Git 仓库的权限
3. 如果某个项目路径不存在或不是 Git 仓库，会跳过并显示警告
4. 脚本会自动处理提交信息的格式，包括主题和详细说明

## 定时任务设置（可选）

如果需要每天自动运行，可以设置 cron 任务：

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每天 23:59 运行）
59 23 * * * cd /path/to/script && /usr/bin/python3 fetch_daily_commits.py
```

## 故障排除

1. **提示 "项目路径不存在"**：检查配置文件中的路径是否正确
2. **提示 "不是 Git 仓库"**：确保路径指向的是 Git 仓库的根目录
3. **没有输出**：检查当天是否有提交记录
4. **编码问题**：确保终端和文件都使用 UTF-8 编码
