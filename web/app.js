const palette = ["#2f6df6", "#14a37f", "#8b5cf6", "#f59e0b", "#d14b4b"];
const storageKey = "aiHubConsoleSettings";
let backendAvailable = false;
let serverSettings = null;

const tools = [
  {
    id: "codex",
    name: "Codex",
    desc: "代码修改、测试、仓库任务",
    usage: {
      today: { tokens: 68400, cost: 2.91, tasks: 8 },
      week: { tokens: 438000, cost: 18.7, tasks: 47 },
      month: { tokens: 1140000, cost: 51.2, tasks: 126 }
    },
    connected: true,
    selected: true,
    source: "本地 session",
    updatedAt: "2 分钟前",
    account: "本机账号"
  },
  {
    id: "claude",
    name: "Claude Code",
    desc: "长文分析、代码审查、复杂推理",
    usage: {
      today: { tokens: 52100, cost: 2.46, tasks: 5 },
      week: { tokens: 392000, cost: 19.4, tasks: 31 },
      month: { tokens: 870000, cost: 43.6, tasks: 88 }
    },
    connected: true,
    selected: true,
    source: "本地日志",
    updatedAt: "5 分钟前",
    account: "本机账号"
  },
  {
    id: "chatgpt",
    name: "ChatGPT / 通用 API",
    desc: "OpenAI、DeepSeek、豆包、千问等兼容接口",
    usage: {
      today: { tokens: 41600, cost: 1.64, tasks: 12 },
      week: { tokens: 286000, cost: 10.8, tasks: 76 },
      month: { tokens: 690000, cost: 24.9, tasks: 214 }
    },
    connected: false,
    selected: true,
    source: "API Key",
    updatedAt: "未同步",
    account: ""
  },
  {
    id: "llama",
    name: "Local Llama",
    desc: "本地隐私任务、低成本批处理",
    usage: {
      today: { tokens: 22100, cost: 0.12, tasks: 17 },
      week: { tokens: 146000, cost: 0.82, tasks: 104 },
      month: { tokens: 300000, cost: 1.9, tasks: 281 }
    },
    connected: false,
    selected: true,
    source: "手动导入",
    updatedAt: "未同步",
    account: ""
  }
];

const trendDays = [
  { day: "周四", cost: 4.8, tokens: 148000, mix: { codex: 34, claude: 28, chatgpt: 25, llama: 13 } },
  { day: "周五", cost: 5.9, tokens: 171000, mix: { codex: 38, claude: 24, chatgpt: 27, llama: 11 } },
  { day: "周六", cost: 3.6, tokens: 98000, mix: { codex: 29, claude: 31, chatgpt: 22, llama: 18 } },
  { day: "周日", cost: 4.2, tokens: 121000, mix: { codex: 24, claude: 36, chatgpt: 21, llama: 19 } },
  { day: "周一", cost: 7.1, tokens: 203000, mix: { codex: 41, claude: 26, chatgpt: 22, llama: 11 } },
  { day: "周二", cost: 9.4, tokens: 337000, mix: { codex: 44, claude: 30, chatgpt: 18, llama: 8 } },
  { day: "今天", cost: 7.13, tokens: 184200, mix: { codex: 37, claude: 28, chatgpt: 23, llama: 12 } }
];

const subscriptionPlan = {
  name: "Pro Monthly",
  monthlyPrice: 20,
  dailyCostLimit: 15,
  monthlyTokenLimit: 3000000,
  monthTokensBeforeToday: 2184000,
  daysLeft: 18,
  topupCreditTotal: 50,
  topupCreditUsedBeforeToday: 11.4
};

const providers = [
  {
    id: "openai",
    name: "OpenAI",
    desc: "官方 OpenAI-compatible 接口",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4.1-mini",
    connected: false,
    lastChecked: "未测试"
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    desc: "国内常用，高性价比推理与代码模型",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    connected: false,
    lastChecked: "未测试"
  },
  {
    id: "qwen",
    name: "通义千问",
    desc: "DashScope 兼容 OpenAI 的调用方式",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
    connected: false,
    lastChecked: "未测试"
  },
  {
    id: "doubao",
    name: "豆包",
    desc: "火山方舟 OpenAI-compatible 接口",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    model: "doubao-seed-1-6",
    connected: false,
    lastChecked: "未测试"
  }
];

const tasks = [
  {
    title: "修复登录页测试失败",
    tool: "Codex",
    status: "running",
    label: "运行中",
    progress: 74,
    tokens: "38.1K",
    cost: "$1.42",
    eta: "约 2 分钟"
  },
  {
    title: "重写定价页文案",
    tool: "Claude Code",
    status: "waiting",
    label: "等审批",
    progress: 52,
    tokens: "29.4K",
    cost: "$1.18",
    eta: "需要允许读取竞品链接"
  },
  {
    title: "生成 API 使用报告",
    tool: "ChatGPT",
    status: "done",
    label: "完成",
    progress: 100,
    tokens: "18.7K",
    cost: "$0.54",
    eta: "已生成复盘"
  },
  {
    title: "本地模型批量总结 issue",
    tool: "Local Llama",
    status: "running",
    label: "运行中",
    progress: 31,
    tokens: "22.1K",
    cost: "$0.12",
    eta: "约 9 分钟"
  }
];

const approvals = [
  {
    title: "Claude Code 请求联网",
    copy: "用于读取竞品官网并比较定价结构。"
  },
  {
    title: "Codex 请求运行测试",
    copy: "命令：npm test，用于验证登录页修复。"
  }
];

const alertRules = [
  {
    id: "daily-limit",
    title: "今日成本超过 80%",
    detail: "接近每日上限时播放提醒音，避免继续消耗充值余额。",
    tone: "审批音"
  },
  {
    id: "monthly-token",
    title: "月度 Token 剩余低于 20%",
    detail: "包月 token 快用完时提醒，方便提前切换低成本工具。",
    tone: "审批音"
  },
  {
    id: "topup-low",
    title: "充值余额低于 $5",
    detail: "额外充值余额不足时提醒，避免任务中断。",
    tone: "审批音"
  },
  {
    id: "task-done",
    title: "任务完成",
    detail: "检测到 Codex、Claude 等任务结束时播放完成音。",
    tone: "完成音"
  },
  {
    id: "approval-needed",
    title: "需要确认",
    detail: "检测到联网、运行命令、读取文件等确认请求时播放审批音。",
    tone: "审批音"
  }
];

const tonePatterns = {
  clear: [523, 659, 784],
  soft: [392, 494, 587],
  focus: [660, 660],
  notice: [440, 330, 440],
  urgent: [392, 523, 392, 523],
  calm: [330, 392]
};

const rangeMeta = {
  today: {
    label: "今日",
    tokenDelta: "较昨日 -12%",
    costNote: "今日还剩",
    taskDelta: "含 2 个运行中"
  },
  week: {
    label: "本周",
    tokenDelta: "较上周 +8%",
    costNote: "7 日累计",
    taskDelta: "比上周多 18 个"
  },
  month: {
    label: "本月",
    tokenDelta: "较上月 +21%",
    costNote: "本月累计",
    taskDelta: "本月总任务"
  }
};

let activeRange = "today";

const taskList = document.querySelector("#taskList");
const toolUsage = document.querySelector("#toolUsage");
const approvalList = document.querySelector("#approvalList");
const alertRuleList = document.querySelector("#alertRuleList");
const toolSelectorList = document.querySelector("#toolSelectorList");
const costTrendChart = document.querySelector("#costTrendChart");
const tokenTrendChart = document.querySelector("#tokenTrendChart");
const mixTrendList = document.querySelector("#mixTrendList");
const usagePie = document.querySelector("#usagePie");
const usageLegend = document.querySelector("#usageLegend");
const toast = document.querySelector("#toast");
const soundToggle = document.querySelector("#soundToggle");
const doneToneSelect = document.querySelector("#doneToneSelect");
const approvalToneSelect = document.querySelector("#approvalToneSelect");
const dailyLimitBar = document.querySelector("#dailyLimitBar");
const monthlyTokenBar = document.querySelector("#monthlyTokenBar");
const topupCreditBar = document.querySelector("#topupCreditBar");
const dailyLimitState = document.querySelector("#dailyLimitState");
const monthlyTokenState = document.querySelector("#monthlyTokenState");
const topupCreditState = document.querySelector("#topupCreditState");
const demoBanner = document.querySelector(".demo-banner");
const demoBannerText = document.querySelector("#demoBannerText");
const backendStatus = document.querySelector("#backendStatus");
const providerList = document.querySelector("#providerList");
const providerSummary = document.querySelector("#providerSummary");
const tokenRateNow = document.querySelector("#tokenRateNow");
const tokenRateState = document.querySelector("#tokenRateState");
const safeTokenRate = document.querySelector("#safeTokenRate");
const hourlyTokenForecast = document.querySelector("#hourlyTokenForecast");
const budgetRunway = document.querySelector("#budgetRunway");
const rateGauge = document.querySelector(".rate-gauge");
const rateGaugePercent = document.querySelector("#rateGaugePercent");

function loadSettings() {
  if (serverSettings) return serverSettings;
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function collectSettings() {
  return {
    activeRange,
    soundEnabled: soundToggle.checked,
    doneTone: doneToneSelect.value,
    approvalTone: approvalToneSelect.value,
    tools: tools.map((tool) => ({
      id: tool.id,
      selected: tool.selected,
      connected: tool.connected,
      account: tool.account,
      updatedAt: tool.updatedAt
    })),
    providers: providers.map((provider) => ({
      id: provider.id,
      baseUrl: provider.baseUrl,
      model: provider.model,
      connected: provider.connected,
      lastChecked: provider.lastChecked
    }))
  };
}

function saveSettings() {
  const settings = collectSettings();
  serverSettings = settings;
  localStorage.setItem(storageKey, JSON.stringify(settings));

  if (backendAvailable) {
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    }).catch(() => {
      backendAvailable = false;
      updateBackendStatus();
    });
  }
}

function updateBackendStatus() {
  if (!backendStatus || !demoBannerText || !demoBanner) return;
  demoBanner.classList.toggle("local", backendAvailable);
  backendStatus.textContent = backendAvailable ? "本地服务已连接" : "静态演示模式";
  demoBannerText.textContent = backendAvailable
    ? "本地服务正在运行：设置会保存到本机，当前用量仍是演示数据，下一步可接入真实日志/API。"
    : "当前网站使用演示数据，真实 Codex、Claude、API Key 和本地模型接入仍在开发中。";
}

async function initBackend() {
  try {
    const healthResponse = await fetch("/api/health", { cache: "no-store" });
    if (!healthResponse.ok) throw new Error("local backend unavailable");
    const health = await healthResponse.json();
    backendAvailable = Boolean(health.ok);

    const settingsResponse = await fetch("/api/settings", { cache: "no-store" });
    if (settingsResponse.ok) {
      serverSettings = await settingsResponse.json();
    }
  } catch {
    backendAvailable = false;
    serverSettings = null;
  }

  updateBackendStatus();
}

async function testOpenAICompatibleTool(tool) {
  if (!backendAvailable) {
    showToast("请先用 npm run dev 启动本地服务，再测试 API Key", "approval");
    return false;
  }

  const baseUrl = window.prompt(
    "填写 OpenAI-compatible Base URL，例如 DeepSeek: https://api.deepseek.com/v1，千问: https://dashscope.aliyuncs.com/compatible-mode/v1"
  );
  if (!baseUrl) return false;

  const apiKey = window.prompt("填写 API Key。它只会发送到你本机 localhost 后端，不会保存到仓库。");
  if (!apiKey) return false;

  const model = window.prompt("填写模型名，例如 deepseek-chat、qwen-plus、doubao-seed-1-6", "deepseek-chat");
  if (!model) return false;

  showToast("正在测试 API 连接...", "done");
  try {
    const response = await fetch("/api/providers/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tool.name,
        baseUrl,
        apiKey,
        model
      })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "接口测试失败");
    }

    tool.connected = true;
    tool.account = `${model} 已验证`;
    tool.updatedAt = "刚刚";
    showToast(`${tool.name} API 已验证`, "done");
    return true;
  } catch (error) {
    showToast(error.message || "接口测试失败", "approval");
    return false;
  }
}

function applySettings() {
  const settings = loadSettings();
  if (settings.activeRange && rangeMeta[settings.activeRange]) {
    activeRange = settings.activeRange;
  }
  if (typeof settings.soundEnabled === "boolean") {
    soundToggle.checked = settings.soundEnabled;
  }
  if (settings.doneTone && tonePatterns[settings.doneTone]) {
    doneToneSelect.value = settings.doneTone;
  }
  if (settings.approvalTone && tonePatterns[settings.approvalTone]) {
    approvalToneSelect.value = settings.approvalTone;
  }
  if (Array.isArray(settings.tools)) {
    settings.tools.forEach((savedTool) => {
      const tool = tools.find((item) => item.id === savedTool.id);
      if (!tool) return;
      if (typeof savedTool.selected === "boolean") tool.selected = savedTool.selected;
      if (typeof savedTool.connected === "boolean") tool.connected = savedTool.connected;
      if (typeof savedTool.account === "string") tool.account = savedTool.account;
      if (typeof savedTool.updatedAt === "string") tool.updatedAt = savedTool.updatedAt;
    });
  }
  if (Array.isArray(settings.providers)) {
    settings.providers.forEach((savedProvider) => {
      const provider = providers.find((item) => item.id === savedProvider.id);
      if (!provider) return;
      if (typeof savedProvider.baseUrl === "string") provider.baseUrl = savedProvider.baseUrl;
      if (typeof savedProvider.model === "string") provider.model = savedProvider.model;
      if (typeof savedProvider.connected === "boolean") provider.connected = savedProvider.connected;
      if (typeof savedProvider.lastChecked === "string") provider.lastChecked = savedProvider.lastChecked;
    });
  }
}

function renderRangeTabs() {
  document.querySelectorAll(".range-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.range === activeRange);
  });
}

function getUsage(tool, range = activeRange) {
  return tool.usage[range];
}

function formatTokens(tokens) {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(2)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return String(tokens);
}

function formatMoney(value) {
  return `$${Math.max(value, 0).toFixed(2)}`;
}

function parseTokenLabel(label) {
  const match = String(label).match(/([\d.]+)\s*([KM]?)/i);
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === "M") return value * 1000000;
  if (unit === "K") return value * 1000;
  return value;
}

function parseEtaMinutes(eta) {
  const match = String(eta).match(/([\d.]+)\s*分钟/);
  return match ? Math.max(Number(match[1]), 1) : 0;
}

function getSelectedTools() {
  return tools.filter((tool) => tool.selected && tool.connected);
}

function getToolActions(tool) {
  if (!tool.connected) {
    const importLabels = {
      codex: "检测本机",
      claude: "选择日志目录",
      chatgpt: "添加 API Key",
      llama: "选择本地服务"
    };
    return `<button class="account-action primary-action" type="button" data-action="import" data-tool="${tool.id}">${importLabels[tool.id]}</button>`;
  }

  const switchLabels = {
    codex: "更换目录",
    claude: "更换日志目录",
    chatgpt: "切换 Key",
    llama: "切换服务"
  };
  const syncLabels = {
    codex: "重新扫描",
    claude: "重新扫描",
    chatgpt: "重新同步",
    llama: "测试连接"
  };

  return `
    <button class="account-action" type="button" data-action="switch" data-tool="${tool.id}">${switchLabels[tool.id]}</button>
    <button class="account-action" type="button" data-action="sync" data-tool="${tool.id}">${syncLabels[tool.id]}</button>
    <button class="account-action subtle" type="button" data-action="disconnect" data-tool="${tool.id}">断开</button>
  `;
}

function renderToolSelector() {
  toolSelectorList.innerHTML = tools
    .map(
      (tool) => {
        return `
        <article class="tool-card ${tool.selected ? "active" : ""}">
          <label>
            <input type="checkbox" data-tool-toggle="${tool.id}" ${tool.selected ? "checked" : ""} />
            ${tool.name}
          </label>
          <small>${tool.desc}</small>
          <div class="tool-source">
            <span>数据来源：${tool.source}</span>
            <span>${tool.connected ? `更新：${tool.updatedAt}` : "未接入时不计入统计"}</span>
          </div>
          <div class="account-row">
            <span class="account-status ${tool.connected ? "" : "disconnected"}">
              ${tool.connected ? `已接入 · ${tool.account}` : "未接入数据源"}
            </span>
          </div>
          <div class="account-actions">${getToolActions(tool)}</div>
        </article>
      `;
      }
    )
    .join("");
}

function renderProviderPanel() {
  providerList.innerHTML = providers
    .map(
      (provider) => `
        <article class="provider-card ${provider.connected ? "connected" : ""}" data-provider-card="${provider.id}">
          <div class="provider-top">
            <div>
              <h3>${provider.name}</h3>
              <p>${provider.desc}</p>
            </div>
            <span class="provider-status ${provider.connected ? "connected" : ""}">
              ${provider.connected ? "已验证" : "未连接"}
            </span>
          </div>
          <label>
            Base URL
            <input data-provider-field="baseUrl" data-provider="${provider.id}" value="${provider.baseUrl}" />
          </label>
          <label>
            模型名
            <input data-provider-field="model" data-provider="${provider.id}" value="${provider.model}" />
          </label>
          <div class="provider-actions">
            <button class="primary-action" type="button" data-provider-action="test" data-provider="${provider.id}">测试连接</button>
            <button type="button" data-provider-action="disconnect" data-provider="${provider.id}">断开</button>
          </div>
          <small>状态：${provider.lastChecked}</small>
        </article>
      `
    )
    .join("");

  const connectedCount = providers.filter((provider) => provider.connected).length;
  providerSummary.textContent = connectedCount ? `已验证 ${connectedCount} 个` : "未连接";
}

function calculateTokenRate() {
  const runningTasks = tasks.filter((task) => task.status === "running");
  return runningTasks.reduce((sum, task) => {
    const etaMinutes = parseEtaMinutes(task.eta);
    if (!etaMinutes || task.progress >= 100) return sum;
    const usedTokens = parseTokenLabel(task.tokens);
    const estimatedTotal = usedTokens / Math.max(task.progress / 100, 0.05);
    const remainingTokens = Math.max(estimatedTotal - usedTokens, 0);
    return sum + remainingTokens / etaMinutes;
  }, 0);
}

function getMinutesLeftToday() {
  const now = new Date();
  return Math.max(24 * 60 - now.getHours() * 60 - now.getMinutes(), 1);
}

function renderRateDashboard() {
  const selectedTools = getSelectedTools();
  const todayTokens = selectedTools.reduce((sum, tool) => sum + tool.usage.today.tokens, 0);
  const todayCost = selectedTools.reduce((sum, tool) => sum + tool.usage.today.cost, 0);
  const averageCostPerToken = todayTokens ? todayCost / todayTokens : 0.00004;
  const remainingCost = Math.max(subscriptionPlan.dailyCostLimit - todayCost, 0);
  const minutesLeft = getMinutesLeftToday();
  const safeRate = averageCostPerToken ? remainingCost / averageCostPerToken / minutesLeft : 0;
  const currentRate = calculateTokenRate();
  const ratio = safeRate ? Math.min((currentRate / safeRate) * 100, 180) : 0;
  const clampedRatio = Math.min(ratio, 100);
  const color = ratio >= 100 ? "var(--danger)" : ratio >= 75 ? "var(--accent-4)" : "var(--accent-2)";
  const runwayMinutes = currentRate && averageCostPerToken ? remainingCost / (currentRate * averageCostPerToken) : 0;

  tokenRateNow.textContent = `${formatTokens(Math.round(currentRate))}/min`;
  safeTokenRate.textContent = `${formatTokens(Math.round(safeRate))}/min`;
  hourlyTokenForecast.textContent = formatTokens(Math.round(currentRate * 60));
  budgetRunway.textContent = runwayMinutes ? `${Math.floor(runwayMinutes / 60)}小时 ${Math.round(runwayMinutes % 60)}分钟` : "暂无运行任务";
  rateGauge.style.background = `conic-gradient(${color} 0 ${clampedRatio * 3.6}deg, #edf2f8 ${clampedRatio * 3.6}deg 360deg)`;
  rateGaugePercent.textContent = `${Math.round(ratio)}%`;

  if (!currentRate) {
    tokenRateState.textContent = "当前没有运行中的任务";
  } else if (ratio >= 100) {
    tokenRateState.textContent = "速度高于今日安全线，建议暂停或切低成本模型";
  } else if (ratio >= 75) {
    tokenRateState.textContent = "速度偏快，接近今日安全线";
  } else {
    tokenRateState.textContent = "当前速度在安全范围内";
  }
}

function renderTrends() {
  const maxCost = Math.max(...trendDays.map((item) => item.cost));
  const maxTokens = Math.max(...trendDays.map((item) => item.tokens));
  const points = trendDays
    .map((item, index) => {
      const x = (index / (trendDays.length - 1)) * 100;
      const y = 100 - (item.cost / maxCost) * 86 - 7;
      return `${x},${y}`;
    })
    .join(" ");

  document.querySelector("#costTrendTotal").textContent = formatMoney(
    trendDays.reduce((sum, item) => sum + item.cost, 0)
  );
  document.querySelector("#tokenTrendTotal").textContent = formatTokens(
    trendDays.reduce((sum, item) => sum + item.tokens, 0)
  );

  costTrendChart.innerHTML = `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="#2f6df6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
    </svg>
    <div class="chart-labels">${trendDays.map((item) => `<span>${item.day}</span>`).join("")}</div>
  `;

  tokenTrendChart.innerHTML = trendDays
    .map((item) => {
      const height = Math.max((item.tokens / maxTokens) * 100, 8);
      return `
        <div class="bar-item">
          <span style="height: ${height}%"></span>
          <em>${item.day}</em>
        </div>
      `;
    })
    .join("");

  mixTrendList.innerHTML = trendDays
    .slice(-4)
    .map(
      (item) => `
        <article class="mix-row">
          <strong>${item.day}</strong>
          <div class="mix-bar" aria-label="${item.day} 工具占比">
            <span style="width: ${item.mix.codex}%; background: ${palette[0]}"></span>
            <span style="width: ${item.mix.claude}%; background: ${palette[1]}"></span>
            <span style="width: ${item.mix.chatgpt}%; background: ${palette[2]}"></span>
            <span style="width: ${item.mix.llama}%; background: ${palette[3]}"></span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderTasks() {
  taskList.innerHTML = tasks
    .map(
      (task, index) => `
        <article class="task">
          <div class="task-top">
            <div>
              <h3>${task.title}</h3>
            </div>
            <span class="badge ${task.status}">${task.label}</span>
          </div>
          <div class="task-stats">
            <div class="task-stat"><span>工具</span><strong>${task.tool}</strong></div>
            <div class="task-stat"><span>Token</span><strong>${task.tokens}</strong></div>
            <div class="task-stat"><span>成本</span><strong>${task.cost}</strong></div>
            <div class="task-stat"><span>预计</span><strong>${task.eta}</strong></div>
          </div>
          <div class="progress-row">
            <div class="progress-label">
              <span>完成进度</span>
              <strong>${task.progress}%</strong>
            </div>
            <div class="progress" aria-label="${task.progress}%">
              <span style="width: ${task.progress}%"></span>
            </div>
          </div>
          <div class="task-actions">
            <button type="button" data-action="complete" data-index="${index}">标记完成</button>
            <button type="button" data-action="approval" data-index="${index}">请求审批</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderUsage() {
  const selectedTools = getSelectedTools();
  const totalTokens = selectedTools.reduce((sum, tool) => sum + getUsage(tool).tokens, 0) || 1;
  let cursor = 0;

  const segments = selectedTools.map((tool, index) => {
    const share = (getUsage(tool).tokens / totalTokens) * 100;
    const start = cursor;
    const end = cursor + share;
    cursor = end;
    return `${palette[index % palette.length]} ${start}% ${end}%`;
  });

  usagePie.style.background = selectedTools.length
    ? `conic-gradient(${segments.join(", ")})`
    : "#e8edf5";

  usageLegend.innerHTML = selectedTools
    .map((tool, index) => {
      const share = Math.round((getUsage(tool).tokens / totalTokens) * 100);
      return `
        <div class="legend-item">
          <span><i class="legend-dot" style="background: ${palette[index % palette.length]}"></i>${tool.name}</span>
          <span>${share}%</span>
        </div>
      `;
    })
    .join("");

  toolUsage.innerHTML = selectedTools
    .map((tool, index) => {
      const usage = getUsage(tool);
      const share = Math.round((usage.tokens / totalTokens) * 100);
      return `
        <div class="usage-item">
          <div class="usage-top">
            <strong>${tool.name}</strong>
            <span>${usage.tokens.toLocaleString()} tokens · $${usage.cost.toFixed(2)} · ${usage.tasks} 个任务</span>
          </div>
          <div class="usage-track" aria-label="${share}%">
            <span style="width: ${share}%; background: ${palette[index % palette.length]}"></span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderApprovals() {
  approvalList.innerHTML = approvals
    .map(
      (item) => `
        <article class="approval-item">
          <div class="approval-top">
            <strong>${item.title}</strong>
            <span class="badge waiting">待确认</span>
          </div>
          <p>${item.copy}</p>
        </article>
      `
    )
    .join("");
}

function renderAlertRules() {
  const selectedTools = getSelectedTools();
  const todayCost = selectedTools.reduce((sum, tool) => sum + tool.usage.today.cost, 0);
  const todayTokens = selectedTools.reduce((sum, tool) => sum + tool.usage.today.tokens, 0);
  const dailyPercent = (todayCost / subscriptionPlan.dailyCostLimit) * 100;
  const monthlyUsed = subscriptionPlan.monthTokensBeforeToday + todayTokens;
  const monthlyLeftPercent = Math.max(100 - (monthlyUsed / subscriptionPlan.monthlyTokenLimit) * 100, 0);
  const todayTopupUsed = Math.max(todayCost - subscriptionPlan.dailyCostLimit, 0);
  const topupLeft = subscriptionPlan.topupCreditTotal - subscriptionPlan.topupCreditUsedBeforeToday - todayTopupUsed;

  const activeRuleIds = new Set([
    dailyPercent >= 80 ? "daily-limit" : "",
    monthlyLeftPercent <= 20 ? "monthly-token" : "",
    topupLeft <= 5 ? "topup-low" : "",
    "task-done",
    "approval-needed"
  ]);

  alertRuleList.innerHTML = alertRules
    .map(
      (rule) => `
        <article class="alert-rule ${activeRuleIds.has(rule.id) ? "active" : ""}">
          <div>
            <strong>${rule.title}</strong>
            <p>${rule.detail}</p>
          </div>
          <span>${activeRuleIds.has(rule.id) ? "已启用" : "监控中"} · ${rule.tone}</span>
        </article>
      `
    )
    .join("");
}

function renderPlan() {
  const selectedTools = getSelectedTools();
  const todayTokens = selectedTools.reduce((sum, tool) => sum + tool.usage.today.tokens, 0);
  const todayCost = selectedTools.reduce((sum, tool) => sum + tool.usage.today.cost, 0);
  const dailyRemaining = subscriptionPlan.dailyCostLimit - todayCost;
  const todayTopupUsed = Math.max(todayCost - subscriptionPlan.dailyCostLimit, 0);
  const topupUsed = Math.min(
    subscriptionPlan.topupCreditUsedBeforeToday + todayTopupUsed,
    subscriptionPlan.topupCreditTotal
  );
  const topupLeft = subscriptionPlan.topupCreditTotal - topupUsed;
  const topupPercent = Math.min((topupUsed / subscriptionPlan.topupCreditTotal) * 100, 100);
  const dailyPercent = Math.min((todayCost / subscriptionPlan.dailyCostLimit) * 100, 100);
  const monthlyUsed = Math.min(subscriptionPlan.monthTokensBeforeToday + todayTokens, subscriptionPlan.monthlyTokenLimit);
  const monthlyLeft = subscriptionPlan.monthlyTokenLimit - monthlyUsed;
  const monthlyPercent = Math.min((monthlyUsed / subscriptionPlan.monthlyTokenLimit) * 100, 100);

  document.querySelector("#planName").textContent = `${subscriptionPlan.name} · $${subscriptionPlan.monthlyPrice}/月`;
  document.querySelector("#planDaysLeft").textContent = `本周期剩余 ${subscriptionPlan.daysLeft} 天`;
  document.querySelector("#dailyUsedCost").textContent = formatMoney(todayCost);
  document.querySelector("#dailyUsedTokens").textContent = `${formatTokens(todayTokens)} tokens`;
  document.querySelector("#dailyRemainingCost").textContent = formatMoney(dailyRemaining);
  document.querySelector("#dailyRemainingPercent").textContent = `剩余 ${Math.max(100 - dailyPercent, 0).toFixed(0)}%`;
  document.querySelector("#monthlyTokenLeft").textContent = formatTokens(monthlyLeft);
  document.querySelector("#monthlyTokenUsed").textContent = `已用 ${monthlyPercent.toFixed(1)}%`;
  document.querySelector("#topupCreditLeft").textContent = formatMoney(topupLeft);
  document.querySelector("#topupCreditUsed").textContent = `今日扣除 ${formatMoney(todayTopupUsed)}`;
  document.querySelector("#dailyLimitLabel").textContent = formatMoney(subscriptionPlan.dailyCostLimit);
  document.querySelector("#monthlyTokenLimit").textContent = formatTokens(subscriptionPlan.monthlyTokenLimit);
  document.querySelector("#topupCreditTotal").textContent = formatMoney(subscriptionPlan.topupCreditTotal);
  document.querySelector("#dailyCostLeft").textContent = `今日还剩 ${formatMoney(dailyRemaining)}`;

  dailyLimitBar.style.width = `${dailyPercent}%`;
  monthlyTokenBar.style.width = `${monthlyPercent}%`;
  topupCreditBar.style.width = `${topupPercent}%`;

  dailyLimitState.className = dailyPercent >= 90 ? "danger" : dailyPercent >= 75 ? "warning" : "";
  dailyLimitState.textContent = dailyPercent >= 90 ? "接近上限" : dailyPercent >= 75 ? "注意控制" : "正常";

  monthlyTokenState.className = monthlyPercent >= 90 ? "danger" : monthlyPercent >= 75 ? "warning" : "";
  monthlyTokenState.textContent = monthlyPercent >= 90 ? "快用完" : monthlyPercent >= 75 ? "剩余偏少" : "剩余充足";

  topupCreditState.className = topupLeft <= 5 ? "danger" : topupLeft <= 15 ? "warning" : "";
  topupCreditState.textContent = topupLeft <= 5 ? "余额很低" : topupLeft <= 15 ? "注意充值" : "可用";
}

function playTone(type) {
  if (!soundToggle.checked) return;

  const selectedTone = type === "approval" ? approvalToneSelect.value : doneToneSelect.value;
  const pattern = tonePatterns[selectedTone];
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audio = new AudioContext();
  const gain = audio.createGain();
  gain.connect(audio.destination);
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(type === "approval" ? 0.2 : 0.16, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.56);

  pattern.forEach((frequency, index) => {
    const oscillator = audio.createOscillator();
    oscillator.type = selectedTone === "soft" || selectedTone === "calm" ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    oscillator.start(audio.currentTime + index * 0.12);
    oscillator.stop(audio.currentTime + index * 0.12 + 0.1);
  });
}

function showToast(message, type = "done") {
  toast.textContent = message;
  toast.classList.add("show");
  playTone(type);
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateCounts() {
  const selectedTools = getSelectedTools();
  const selectedTokenCount = selectedTools.reduce((sum, tool) => sum + getUsage(tool).tokens, 0);
  const selectedCost = selectedTools.reduce((sum, tool) => sum + getUsage(tool).cost, 0);
  const selectedTaskCount = selectedTools.reduce((sum, tool) => sum + getUsage(tool).tasks, 0);
  const meta = rangeMeta[activeRange];

  document.querySelector("#approvalCount").textContent = approvals.length;
  const checkedCount = tools.filter((tool) => tool.selected).length;
  document.querySelector("#selectedToolsCount").textContent = `统计中 ${selectedTools.length} 个 / 已勾选 ${checkedCount} 个`;
  document.querySelector("#tokenSummaryLabel").textContent = `${meta.label} Token`;
  document.querySelector("#costSummaryLabel").textContent = `${meta.label}成本`;
  document.querySelector("#taskSummaryLabel").textContent = `${meta.label}任务数`;
  document.querySelector("#tokenDelta").textContent = meta.tokenDelta;
  document.querySelector("#taskDelta").textContent = meta.taskDelta;
  document.querySelector("#totalTokens").textContent = formatTokens(selectedTokenCount);
  document.querySelector("#totalCost").textContent = formatMoney(selectedCost);
  document.querySelector("#taskCount").textContent = selectedTaskCount;

  if (activeRange === "today") {
    const dailyLeft = subscriptionPlan.dailyCostLimit - selectedTools.reduce((sum, tool) => sum + tool.usage.today.cost, 0);
    document.querySelector("#dailyCostLeft").textContent = `${meta.costNote} ${formatMoney(dailyLeft)}`;
  } else {
    document.querySelector("#dailyCostLeft").textContent = meta.costNote;
  }
}

function refreshToolViews() {
  renderToolSelector();
  renderProviderPanel();
  renderUsage();
  renderPlan();
  renderAlertRules();
  renderTrends();
  renderRateDashboard();
  updateCounts();
}

document.querySelector("#doneSound").addEventListener("click", () => {
  showToast("已播放你选择的完成提示音", "done");
});

document.querySelector("#approvalSound").addEventListener("click", () => {
  showToast("已播放你选择的审批提示音", "approval");
});

document.querySelector("#applySounds").addEventListener("click", () => {
  saveSettings();
  showToast("已应用提示音设置：先试听完成音，再试听审批音", "done");
  window.setTimeout(() => playTone("approval"), 700);
});

soundToggle.addEventListener("change", saveSettings);
doneToneSelect.addEventListener("change", saveSettings);
approvalToneSelect.addEventListener("change", saveSettings);

document.querySelector(".range-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-range]");
  if (!button) return;
  activeRange = button.dataset.range;
  renderRangeTabs();
  renderUsage();
  updateCounts();
  saveSettings();
  showToast(`已切换到${rangeMeta[activeRange].label}统计`, "done");
});

document.querySelector(".nav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-target]");
  if (!button) return;
  const target = document.querySelector(`#${button.dataset.target}`);
  if (!target) return;
  document.querySelectorAll(".nav button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

toolSelectorList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-tool-toggle]");
  if (!input) return;
  const tool = tools.find((item) => item.id === input.dataset.toolToggle);
  tool.selected = input.checked;
  refreshToolViews();
  saveSettings();
});

toolSelectorList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const tool = tools.find((item) => item.id === button.dataset.tool);
  const action = button.dataset.action;

  if (action === "import") {
    if (tool.id === "chatgpt") {
      const connected = await testOpenAICompatibleTool(tool);
      if (!connected) return;
    } else {
      tool.connected = true;
      tool.account = tool.id === "llama" ? "本地服务" : "本机账号";
      tool.updatedAt = "刚刚";
      showToast(`${tool.name} 数据源已接入`, "done");
    }
  }

  if (action === "switch") {
    if (tool.id === "chatgpt") {
      const connected = await testOpenAICompatibleTool(tool);
      if (!connected) return;
    } else if (tool.id === "llama") {
      tool.account = tool.account === "本地服务" ? "远程服务" : "本地服务";
    } else {
      tool.account = tool.account === "本机账号" ? "备用目录" : "本机账号";
    }
    tool.updatedAt = "刚刚";
    showToast(`${tool.name} 已切换到${tool.account}`, "done");
  }

  if (action === "sync") {
    if (tool.id === "chatgpt") {
      const connected = await testOpenAICompatibleTool(tool);
      if (!connected) return;
    } else {
      tool.updatedAt = "刚刚";
      showToast(`${tool.name} 数据已重新同步`, "done");
    }
  }

  if (action === "disconnect") {
    tool.connected = false;
    tool.account = "";
    tool.updatedAt = "未同步";
    showToast(`${tool.name} 已断开连接`, "approval");
  }

  refreshToolViews();
  saveSettings();
});

providerList.addEventListener("change", (event) => {
  const input = event.target.closest("[data-provider-field]");
  if (!input) return;
  const provider = providers.find((item) => item.id === input.dataset.provider);
  if (!provider) return;
  provider[input.dataset.providerField] = input.value.trim();
  provider.connected = false;
  provider.lastChecked = "配置已修改，等待重新测试";
  renderProviderPanel();
  saveSettings();
});

providerList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-provider-action]");
  if (!button) return;
  const provider = providers.find((item) => item.id === button.dataset.provider);
  if (!provider) return;

  if (button.dataset.providerAction === "disconnect") {
    provider.connected = false;
    provider.lastChecked = "已断开";
    renderProviderPanel();
    saveSettings();
    showToast(`${provider.name} 已断开`, "approval");
    return;
  }

  if (!backendAvailable) {
    showToast("请先用 npm run dev 启动本地服务", "approval");
    return;
  }

  const apiKey = window.prompt(`填写 ${provider.name} API Key。Key 只发送到本机 localhost，不会保存。`);
  if (!apiKey) return;

  showToast(`正在测试 ${provider.name}...`, "done");
  try {
    const response = await fetch("/api/providers/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: provider.name,
        baseUrl: provider.baseUrl,
        apiKey,
        model: provider.model
      })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "接口测试失败");
    }
    provider.connected = true;
    provider.lastChecked = `刚刚验证成功 · ${provider.model}`;

    if (provider.id !== "openai") {
      const genericTool = tools.find((tool) => tool.id === "chatgpt");
      if (genericTool) {
        genericTool.connected = true;
        genericTool.account = `${provider.name} · ${provider.model}`;
        genericTool.updatedAt = "刚刚";
      }
    }

    refreshToolViews();
    saveSettings();
    showToast(`${provider.name} 连接成功`, "done");
  } catch (error) {
    provider.connected = false;
    provider.lastChecked = error.message || "测试失败";
    renderProviderPanel();
    saveSettings();
    showToast(provider.lastChecked, "approval");
  }
});

taskList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const task = tasks[Number(button.dataset.index)];
  if (button.dataset.action === "complete") {
    task.status = "done";
    task.label = "完成";
    task.progress = 100;
    task.eta = "已完成";
    renderTasks();
    updateCounts();
    renderRateDashboard();
    showToast(`${task.tool} 任务已完成`, "done");
  }

  if (button.dataset.action === "approval") {
    task.status = "waiting";
    task.label = "等审批";
    approvals.unshift({
      title: `${task.tool} 请求你确认`,
      copy: `任务：${task.title}`
    });
    renderTasks();
    renderApprovals();
    updateCounts();
    renderRateDashboard();
    showToast("新的审批请求已加入中心", "approval");
  }
});

async function initializeApp() {
  await initBackend();
  applySettings();
  renderRangeTabs();
  renderTasks();
  renderApprovals();
  refreshToolViews();
}

initializeApp();
