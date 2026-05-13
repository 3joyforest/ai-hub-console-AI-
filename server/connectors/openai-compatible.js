const DEFAULT_TIMEOUT_MS = 12000;

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || "").trim().replace(/\/+$/, "");
}

function buildChatCompletionsUrl(baseUrl) {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) return "";
  return `${normalized}/chat/completions`;
}

async function testOpenAICompatibleProvider({ baseUrl, apiKey, model }) {
  const endpoint = buildChatCompletionsUrl(baseUrl);
  const cleanKey = String(apiKey || "").trim();
  const cleanModel = String(model || "").trim();

  if (!endpoint) {
    throw new Error("请填写 Base URL，例如 https://api.deepseek.com/v1");
  }
  if (!cleanKey) {
    throw new Error("请填写 API Key");
  }
  if (!cleanModel) {
    throw new Error("请填写模型名，例如 deepseek-chat");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cleanKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: cleanModel,
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
        temperature: 0
      })
    });

    const text = await response.text();
    let payload = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text.slice(0, 400) };
    }

    if (!response.ok) {
      const detail = payload.error?.message || payload.message || response.statusText;
      throw new Error(`接口返回 ${response.status}: ${detail}`);
    }

    return {
      ok: true,
      endpoint,
      model: cleanModel,
      usage: payload.usage || null
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("接口测试超时，请检查 Base URL、网络或模型名");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  buildChatCompletionsUrl,
  testOpenAICompatibleProvider
};
