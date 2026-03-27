import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

const PORT = Number(process.env.PORT || 3232);
const HOST = process.env.HOST || '127.0.0.1';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen3.5:4b';
const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || '你是一个简洁、靠谱的本地 AI 助手。';

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function serveStaticFile(res, filePath, contentType) {
  try {
    const content = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    });
    res.end(content);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}

async function fetchOllamaModels() {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
  if (!response.ok) {
    throw new Error(`Ollama models request failed: ${response.status}`);
  }

  return response.json();
}

async function handleModels(res) {
  try {
    const data = await fetchOllamaModels();
    const models = (data.models || []).map((item) => item.name);

    sendJson(res, 200, {
      models,
      defaultModel: DEFAULT_MODEL,
      baseURL: OLLAMA_BASE_URL,
    });
  } catch (error) {
    sendJson(res, 502, {
      error: '无法连接到本地 Ollama',
      details: error.message,
      models: [DEFAULT_MODEL],
      defaultModel: DEFAULT_MODEL,
      baseURL: OLLAMA_BASE_URL,
    });
  }
}

async function handleHealth(res) {
  try {
    const data = await fetchOllamaModels();
    sendJson(res, 200, {
      ok: true,
      modelCount: data.models?.length || 0,
      baseURL: OLLAMA_BASE_URL,
    });
  } catch (error) {
    sendJson(res, 502, {
      ok: false,
      baseURL: OLLAMA_BASE_URL,
      error: error.message,
    });
  }
}

async function handleChat(req, res) {
  try {
    const body = await readBody(req);
    const model = body.model || DEFAULT_MODEL;
    const history = Array.isArray(body.messages) ? body.messages : [];
    const userMessage = typeof body.message === 'string' ? body.message.trim() : '';

    if (!userMessage) {
      sendJson(res, 400, { error: 'message 不能为空' });
      return;
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: userMessage },
    ];

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!ollamaResponse.ok || !ollamaResponse.body) {
      const errorText = await ollamaResponse.text();
      sendJson(res, 502, {
        error: 'Ollama 聊天接口调用失败',
        details: errorText || `status ${ollamaResponse.status}`,
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'Transfer-Encoding': 'chunked',
    });

    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (error) {
    sendJson(res, 500, {
      error: '聊天服务异常',
      details: error.message,
    });
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/') {
    await serveStaticFile(res, path.join(publicDir, 'index.html'), 'text/html; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && url.pathname === '/app.js') {
    await serveStaticFile(res, path.join(publicDir, 'app.js'), 'text/javascript; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && url.pathname === '/styles.css') {
    await serveStaticFile(res, path.join(publicDir, 'styles.css'), 'text/css; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/models') {
    await handleModels(res);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    await handleHealth(res);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/chat') {
    await handleChat(req, res);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`Jarvis Local running at http://${HOST}:${PORT}`);
  console.log(`Using Ollama at ${OLLAMA_BASE_URL}`);
  console.log(`Default model: ${DEFAULT_MODEL}`);
});
