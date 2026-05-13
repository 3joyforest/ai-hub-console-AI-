const http = require("http");
const fs = require("fs");
const path = require("path");
const { testOpenAICompatibleProvider } = require("./connectors/openai-compatible");

const PORT = Number(process.env.PORT || 8787);
const ROOT_DIR = path.resolve(__dirname, "..");
const WEB_DIR = path.join(ROOT_DIR, "web");
const DATA_DIR = path.join(__dirname, "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.local.json");
const SETTINGS_EXAMPLE_FILE = path.join(DATA_DIR, "settings.example.json");
const USAGE_FILE = path.join(DATA_DIR, "usage.local.json");
const USAGE_EXAMPLE_FILE = path.join(DATA_DIR, "usage.example.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function ensureLocalFile(filePath, examplePath, fallback) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (fs.existsSync(filePath)) return;
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, filePath);
    return;
  }
  fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("请求体过大"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("请求体不是合法 JSON"));
      }
    });
    request.on("error", reject);
  });
}

function getStaticPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname);
  const requestedPath = decoded === "/" ? "/index.html" : decoded;
  const normalized = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(WEB_DIR, normalized);
  if (!fullPath.startsWith(WEB_DIR)) return null;
  return fullPath;
}

function serveStatic(request, response, pathname) {
  const filePath = getStaticPath(pathname);
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": MIME_TYPES[extension] || "application/octet-stream"
  });
  fs.createReadStream(filePath).pipe(response);
}

async function handleApi(request, response, pathname) {
  if (request.method === "GET" && pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      app: "AI Hub Console",
      mode: "local",
      version: "0.2.0"
    });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/settings") {
    sendJson(response, 200, readJson(SETTINGS_FILE));
    return true;
  }

  if ((request.method === "POST" || request.method === "PUT") && pathname === "/api/settings") {
    const settings = await readRequestBody(request);
    writeJson(SETTINGS_FILE, settings);
    sendJson(response, 200, { ok: true, savedAt: new Date().toISOString() });
    return true;
  }

  if (request.method === "GET" && pathname === "/api/usage") {
    sendJson(response, 200, readJson(USAGE_FILE));
    return true;
  }

  if (request.method === "POST" && pathname === "/api/providers/test") {
    const body = await readRequestBody(request);
    const result = await testOpenAICompatibleProvider(body);
    sendJson(response, 200, {
      ok: true,
      provider: body.name || "OpenAI-compatible",
      ...result
    });
    return true;
  }

  return false;
}

ensureLocalFile(SETTINGS_FILE, SETTINGS_EXAMPLE_FILE, {});
ensureLocalFile(USAGE_FILE, USAGE_EXAMPLE_FILE, {});

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  try {
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(request, response, url.pathname);
      if (!handled) sendJson(response, 404, { ok: false, error: "API not found" });
      return;
    }

    serveStatic(request, response, url.pathname);
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: error.message || "Server error"
    });
  }
});

server.listen(PORT, () => {
  console.log(`AI Hub Console local server: http://localhost:${PORT}`);
});
