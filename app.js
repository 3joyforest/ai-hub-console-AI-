const palette = ["#2f6df6", "#14a37f", "#8b5cf6", "#f59e0b", "#d14b4b"];

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
    name: "ChatGPT",
    desc: "日常问答、总结、轻量自动化",
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
  renderUsage();
  renderPlan();
  renderAlertRules();
  renderTrends();
  updateCounts();
}

document.querySelector("#doneSound").addEventListener("click", () => {
  showToast("已播放你选择的完成提示音", "done");
});

document.querySelector("#approvalSound").addEventListener("click", () => {
  showToast("已播放你选择的审批提示音", "approval");
});

document.querySelector("#applySounds").addEventListener("click", () => {
  showToast("已应用提示音设置：先试听完成音，再试听审批音", "done");
  window.setTimeout(() => playTone("approval"), 700);
});

document.querySelector(".range-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-range]");
  if (!button) return;
  activeRange = button.dataset.range;
  document.querySelectorAll(".range-tabs button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderUsage();
  updateCounts();
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
});

toolSelectorList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const tool = tools.find((item) => item.id === button.dataset.tool);
  const action = button.dataset.action;

  if (action === "import") {
    tool.connected = true;
    tool.account = tool.id === "chatgpt" ? "个人 Key" : tool.id === "llama" ? "本地服务" : "本机账号";
    tool.updatedAt = "刚刚";
    showToast(`${tool.name} 数据源已接入`, "done");
  }

  if (action === "switch") {
    if (tool.id === "chatgpt") {
      tool.account = tool.account === "个人 Key" ? "公司 Key" : "个人 Key";
    } else if (tool.id === "llama") {
      tool.account = tool.account === "本地服务" ? "远程服务" : "本地服务";
    } else {
      tool.account = tool.account === "本机账号" ? "备用目录" : "本机账号";
    }
    tool.updatedAt = "刚刚";
    showToast(`${tool.name} 已切换到${tool.account}`, "done");
  }

  if (action === "sync") {
    tool.updatedAt = "刚刚";
    showToast(`${tool.name} 数据已重新同步`, "done");
  }

  if (action === "disconnect") {
    tool.connected = false;
    tool.account = "";
    tool.updatedAt = "未同步";
    showToast(`${tool.name} 已断开连接`, "approval");
  }

  refreshToolViews();
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
    showToast("新的审批请求已加入中心", "approval");
  }
});

renderTasks();
renderApprovals();
refreshToolViews();
