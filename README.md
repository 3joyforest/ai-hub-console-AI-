# AI Hub Console

一个本地优先的 AI 工具用量、额度余额和提示音提醒看板原型。

AI Hub Console 的第一版目标很明确：先把多个 AI 工具的使用情况、包月额度、充值余额和提醒状态集中展示出来。现在仓库同时支持两种模式：

- GitHub Pages：公开演示页，使用 demo 数据。
- 本地服务：运行在你自己的电脑上，设置保存到本机，并提供 OpenAI-compatible API 测试接口。

> 当前版本的用量统计仍是演示数据；本地服务已经能保存设置，并能测试 DeepSeek、通义千问、豆包等 OpenAI-compatible 接口。后续可以继续接 Codex / Claude 本地日志和真实用量。

## 功能亮点

- 查看 AI 工具 token 用量和估算成本
- 支持今日、本周、本月统计切换
- 显示包月计划、每日上限、本月 token 剩余
- 显示额外充值余额和预计扣费
- 显示 7 日成本趋势和 token 趋势
- 显示不同工具的用量占比
- 支持浏览器提示音测试
- 支持任务完成、审批确认、额度告警等提醒规则展示
- 区分不同工具的数据源接入方式

## 本地运行（推荐）

这个项目目前不需要安装依赖，只需要 Node.js 18 或更高版本。

```bash
git clone <你的仓库地址>
cd <项目文件夹>
npm run dev
```

然后打开：

```text
http://localhost:8787
```

本地服务启动后：

- 设置会保存到 `server/data/settings.local.json`
- 用量 demo 数据会读取 `server/data/usage.local.json`
- 这两个 `.local.json` 文件不会提交到 GitHub，避免误传私人配置

## 静态演示

如果只是想看 GitHub Pages 或静态 demo，可以直接打开：

```text
web/index.html
```

也可以用任意静态服务器预览 `web/` 目录。

## 本地 API

### 健康检查

```text
GET /api/health
```

### 读取 / 保存设置

```text
GET /api/settings
POST /api/settings
```

### 读取用量数据

```text
GET /api/usage
```

### 测试 OpenAI-compatible 服务

```text
POST /api/providers/test
```

请求体示例：

```json
{
  "name": "DeepSeek",
  "baseUrl": "https://api.deepseek.com/v1",
  "apiKey": "你的 API Key",
  "model": "deepseek-chat"
}
```

常见 Base URL：

- DeepSeek：`https://api.deepseek.com/v1`
- 通义千问 DashScope：`https://dashscope.aliyuncs.com/compatible-mode/v1`
- 豆包火山方舟：`https://ark.cn-beijing.volces.com/api/v3`

页面里可以在 `接入工具` 的 ChatGPT / OpenAI 卡片点击 `添加 API Key` 或 `切换 Key` 来测试。Key 只会发送给你本机的 `localhost:8787`，当前版本不会保存明文 Key。

## 当前模块

### 总览

- 总 token
- 总成本
- 任务数
- 待审批数量
- 今日 / 本周 / 本月切换

### 预算与余额

- 包月计划
- 今日成本上限
- 今日剩余额度
- 本月 token 总额度
- 本月 token 剩余
- 额外充值余额
- 充值余额扣费展示

### 历史趋势

- 7 日每日成本折线图
- 7 日 token 用量柱状图
- 最近几天工具占比条

### 工具消耗

- Codex
- Claude Code
- ChatGPT / OpenAI
- Local Llama

未接入的数据源不会计入统计。

### 接入工具

不同工具有不同接入方式：

- Codex：检测本机、更换目录、重新扫描
- Claude Code：选择日志目录、更换日志目录、重新扫描
- ChatGPT / OpenAI：添加 API Key、切换 Key、重新同步
- Local Llama：选择本地服务、切换服务、测试连接

Codex、Claude Code 和 Local Llama 目前仍是原型交互；ChatGPT / OpenAI-compatible 已经可以通过本地服务测试 API Key。

### 提醒中心

- 提示音设置
- 一键测试提示音
- 今日成本超过 80% 提醒
- 月度 token 剩余低于 20% 提醒
- 充值余额低于 $5 提醒
- 任务完成提醒
- 需要确认时提醒

## 目前还不能做什么

当前版本暂时不能：

- 真实读取 Codex 本地 session
- 真实读取 Claude Code 日志
- 真实读取 Cursor / Copilot 用量
- 自动拉取 OpenAI / Anthropic / DeepSeek / 豆包 / 通义千问账单
- 安全加密保存 API Key
- 后台运行
- 系统级通知
- 自动检测 Codex 或 Claude 任务完成

## 后续路线图

建议按这个顺序继续做：

1. 增加 Codex / Claude Code 本地日志读取
2. 支持手动导入 JSON / CSV 用量数据
3. 增加 OpenAI / Anthropic / DeepSeek / 豆包 / 通义千问真实用量同步
4. 本机安全保存 API Key
5. 增加后台监控和系统通知
6. 打包成 Tauri 或 Electron 桌面应用
7. 增加菜单栏提醒

## GitHub Pages 发布

GitHub Pages 只能发布静态演示页，不能运行本地 Node 服务，也不能安全处理 API Key。

1. 把项目 push 到 GitHub
2. 打开仓库 `Settings`
3. 找到 `Pages`
4. Source 选择主分支，比如 `main`
5. 目录选择 `/root`
6. 保存，等待 GitHub Pages 构建完成

发布后，它会成为一个公开 demo 网站。真正可用的本地版本请用 `npm run dev` 运行。

## 项目结构

```text
.
├── package.json
├── web/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server/
│   ├── server.js
│   ├── connectors/
│   │   └── openai-compatible.js
│   └── data/
│       ├── settings.example.json
│       └── usage.example.json
├── README.md
├── LICENSE
└── .gitignore
```

## License

MIT

---

## English

AI Hub Console is a local-first dashboard prototype for tracking AI tool usage, quotas, credits, and sound alerts.

The first version focuses on a lightweight personal dashboard:

- AI tool usage statistics
- Daily, weekly, and monthly views
- Monthly plan and daily spending limit
- Extra credit balance tracking
- Token and cost trends
- Sound alerts for task completion, approvals, and quota warnings
- Tool data-source connection states

The public GitHub Pages version is still a static demo. The local Node server can save settings and test OpenAI-compatible API providers.

### Local Setup

Node.js 18+ is required.

```bash
git clone <your-repo-url>
cd <repo-folder>
npm run dev
```

Then visit:

```text
http://localhost:8787
```

### Current Status

Usage data is still demo data. Real local log reading, encrypted API key storage, background monitoring, and system notifications are planned for future versions.
