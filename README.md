# AI Hub Console

一个本地优先的 AI 工具用量、额度余额和提示音提醒看板原型。

AI Hub Console 的第一版目标很明确：先把多个 AI 工具的使用情况、包月额度、充值余额和提醒状态集中展示出来。它目前是一个静态前端 MVP，适合做产品 demo、GitHub 展示页和后续真实数据接入的基础。

> 当前版本不会读取真实 Codex、Claude Code、Cursor、OpenAI、Anthropic、DeepSeek、豆包或通义千问数据。页面中的数据是演示数据。

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

## 本地运行

这个项目不需要安装依赖。

```bash
git clone <你的仓库地址>
cd <项目文件夹>
```

然后直接打开：

```bash
open index.html
```

Windows 用户可以双击 `index.html`，或用浏览器打开它。

## 本地部署

如果你想用本地服务器预览，可以使用 Python：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

也可以使用 Node.js：

```bash
npx serve .
```

然后打开命令行显示的地址。

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

这些操作目前是原型交互，不会真正读取本机数据或保存 API Key。

### 提醒中心

- 提示音设置
- 一键测试提示音
- 今日成本超过 80% 提醒
- 月度 token 剩余低于 20% 提醒
- 充值余额低于 $5 提醒
- 任务完成提醒
- 需要确认时提醒

## 目前还不能做什么

当前版本还是静态 MVP，暂时不能：

- 真实读取 Codex 本地 session
- 真实读取 Claude Code 日志
- 真实读取 Cursor / Copilot 用量
- 连接 OpenAI / Anthropic / DeepSeek / 豆包 / 通义千问 API
- 安全保存 API Key
- 刷新后保存设置
- 后台运行
- 系统级通知
- 自动检测 Codex 或 Claude 任务完成

## 后续路线图

建议按这个顺序继续做：

1. 使用 `localStorage` 保存设置
2. 支持手动导入 JSON / CSV 用量数据
3. 增加 Codex / Claude Code 本地日志读取
4. 增加 OpenAI / Anthropic / DeepSeek / 豆包 / 通义千问 API Key 接入
5. 增加后台监控和系统通知
6. 打包成 Tauri 或 Electron 桌面应用
7. 增加菜单栏提醒

## GitHub Pages 发布

这个项目是纯静态网站，可以直接用 GitHub Pages 发布。

1. 把项目 push 到 GitHub
2. 打开仓库 `Settings`
3. 找到 `Pages`
4. Source 选择主分支，比如 `main`
5. 目录选择 `/root`
6. 保存，等待 GitHub Pages 构建完成

发布后，它会成为一个公开 demo 网站。

## 项目结构

```text
.
├── index.html
├── styles.css
├── app.js
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

This is currently a static frontend MVP. It does not yet read real Codex, Claude Code, Cursor, OpenAI, Anthropic, DeepSeek, Doubao, or Qwen usage data.

### Local Setup

No package installation is required.

```bash
git clone <your-repo-url>
cd <repo-folder>
open index.html
```

Or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

### Current Status

This project is a static MVP/demo. Real local data reading, API key storage, background monitoring, and system notifications are planned for future versions.
