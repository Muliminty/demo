const messagesEl = document.getElementById('messages');
const composerEl = document.getElementById('composer');
const inputEl = document.getElementById('message-input');
const sendBtnEl = document.getElementById('send-btn');
const modelSelectEl = document.getElementById('model-select');
const modelHintEl = document.getElementById('model-hint');
const statusTextEl = document.getElementById('status-text');
const statusDotEl = document.getElementById('status-dot');
const newChatBtnEl = document.getElementById('new-chat-btn');
const messagesInnerEl = document.getElementById('messages-inner');
const activeModelPillEl = document.getElementById('active-model-pill');
const composerTipEl = document.getElementById('composer-tip');

let chatHistory = [];

function setStatus(ok, text) {
  statusTextEl.textContent = text;
  statusDotEl.classList.toggle('ok', ok);
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function autoResizeTextarea() {
  inputEl.style.height = 'auto';
  inputEl.style.height = `${Math.min(inputEl.scrollHeight, 220)}px`;
}

function createMessage(role, content = '') {
  const wrapper = document.createElement('article');
  wrapper.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'user' ? '我' : 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = content;

  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  messagesInnerEl.appendChild(wrapper);
  scrollToBottom();

  return { wrapper, bubble };
}

function addMessage(role, content = '') {
  return createMessage(role, content).bubble;
}

function createPendingBubble() {
  const { bubble } = createMessage('assistant', '正在思考...');
  bubble.classList.add('is-pending');
  bubble.innerHTML = `
    <span class="typing-row">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </span>
  `;
  return bubble;
}

function createAssistantStreamMessage() {
  const wrapper = document.createElement('article');
  wrapper.className = 'message assistant';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble-stream is-pending';

  const thinkingBlock = document.createElement('section');
  thinkingBlock.className = 'thinking-block';
  thinkingBlock.hidden = true;

  const thinkingLabel = document.createElement('div');
  thinkingLabel.className = 'thinking-label';
  thinkingLabel.textContent = '思考过程';

  const thinkingBody = document.createElement('pre');
  thinkingBody.className = 'thinking-body';
  thinkingBody.textContent = '';

  thinkingBlock.appendChild(thinkingLabel);
  thinkingBlock.appendChild(thinkingBody);

  const answerBlock = document.createElement('section');
  answerBlock.className = 'answer-block';

  const answerBody = document.createElement('div');
  answerBody.className = 'answer-body';
  answerBody.innerHTML = `
    <span class="typing-row">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </span>
  `;

  answerBlock.appendChild(answerBody);
  bubble.appendChild(thinkingBlock);
  bubble.appendChild(answerBlock);
  wrapper.appendChild(avatar);
  wrapper.appendChild(bubble);
  messagesInnerEl.appendChild(wrapper);
  scrollToBottom();

  return {
    bubble,
    thinkingBlock,
    thinkingBody,
    answerBody,
  };
}

function parseAssistantOutput(rawText) {
  const thinkOpenTag = '<think>';
  const thinkCloseTag = '</think>';
  const thinkStart = rawText.indexOf(thinkOpenTag);

  if (thinkStart === -1) {
    return {
      thinking: '',
      answer: rawText.trim(),
      isThinkingOpen: false,
    };
  }

  const beforeThink = rawText.slice(0, thinkStart);
  const rest = rawText.slice(thinkStart + thinkOpenTag.length);
  const thinkEnd = rest.indexOf(thinkCloseTag);

  if (thinkEnd === -1) {
    return {
      thinking: rest.trim(),
      answer: beforeThink.trim(),
      isThinkingOpen: true,
    };
  }

  const thinking = rest.slice(0, thinkEnd).trim();
  const afterThink = rest.slice(thinkEnd + thinkCloseTag.length).trim();

  return {
    thinking,
    answer: [beforeThink.trim(), afterThink].filter(Boolean).join('\n\n').trim(),
    isThinkingOpen: false,
  };
}

function renderAssistantStream(view, rawText) {
  const parsed = parseAssistantOutput(rawText);

  if (parsed.thinking) {
    view.thinkingBlock.hidden = false;
    view.thinkingBody.textContent = parsed.thinking;
  } else {
    view.thinkingBlock.hidden = true;
    view.thinkingBody.textContent = '';
  }

  if (parsed.answer) {
    view.bubble.classList.remove('is-pending');
    view.answerBody.textContent = parsed.answer;
  } else if (parsed.isThinkingOpen) {
    view.bubble.classList.remove('is-pending');
    view.answerBody.textContent = '正在整理最终回答...';
    view.answerBody.classList.add('is-drafting');
  } else {
    view.answerBody.classList.remove('is-drafting');
    view.answerBody.innerHTML = `
      <span class="typing-row">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </span>
    `;
  }

  if (parsed.answer) {
    view.answerBody.classList.remove('is-drafting');
  }

  scrollToBottom();

  return parsed;
}

async function loadModels() {
  try {
    const response = await fetch('/api/models');
    const data = await response.json();

    modelSelectEl.innerHTML = '';
    const models = data.models?.length ? data.models : [data.defaultModel];

    for (const modelName of models) {
      const option = document.createElement('option');
      option.value = modelName;
      option.textContent = modelName;
      option.selected = modelName === data.defaultModel;
      modelSelectEl.appendChild(option);
    }

    activeModelPillEl.textContent = `CORE MODEL // ${modelSelectEl.value || data.defaultModel}`;
    modelHintEl.textContent = `Ollama 地址：${data.baseURL}`;
    setStatus(response.ok, response.ok ? 'Ollama 已连接' : 'Ollama 未连接，先检查服务');
  } catch (error) {
    modelSelectEl.innerHTML = '<option value="qwen3.5:4b">qwen3.5:4b</option>';
    activeModelPillEl.textContent = 'CORE MODEL // qwen3.5:4b';
    modelHintEl.textContent = '无法读取模型列表，已使用默认模型占位。';
    setStatus(false, '读取本地 Ollama 失败');
  }
}

async function sendMessage(message) {
  addMessage('user', message);
  const assistantView = createAssistantStreamMessage();
  let assistantRawText = '';
  let assistantThinkingText = '';

  sendBtnEl.disabled = true;
  inputEl.disabled = true;
  modelSelectEl.disabled = true;
  composerTipEl.textContent = 'JARVIS 核心正在响应...';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
    model: modelSelectEl.value,
        message,
        messages: chatHistory,
      }),
    });

    if (!response.ok || !response.body) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || '请求失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        const chunk = JSON.parse(line);
        const content = chunk.message?.content || '';
        const thinking = chunk.message?.thinking || '';

        if (thinking) {
          assistantThinkingText += thinking;
          assistantView.thinkingBlock.hidden = false;
          assistantView.thinkingBody.textContent = assistantThinkingText;
        }

        if (content) {
          assistantRawText += content;
          renderAssistantStream(assistantView, assistantRawText);
        }
      }
    }

    if (buffer.trim()) {
      const chunk = JSON.parse(buffer);
      const content = chunk.message?.content || '';
      const thinking = chunk.message?.thinking || '';

      if (thinking) {
        assistantThinkingText += thinking;
        assistantView.thinkingBlock.hidden = false;
        assistantView.thinkingBody.textContent = assistantThinkingText;
      }

      if (content) {
        assistantRawText += content;
        renderAssistantStream(assistantView, assistantRawText);
      }
    }

    const parsed = renderAssistantStream(assistantView, assistantRawText);
    let finalAnswer = parsed.answer;
    let finalThinking = assistantThinkingText || parsed.thinking;

    if (!finalAnswer && finalThinking) {
      finalAnswer = '思考完成，但没有生成最终回答。';
      assistantView.answerBody.textContent = finalAnswer;
    }

    if (!finalAnswer) {
      finalAnswer = '模型没有返回可显示内容。';
      assistantView.bubble.classList.remove('is-pending');
      assistantView.answerBody.textContent = finalAnswer;
    }

    chatHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: finalAnswer }
    );
  } catch (error) {
    assistantView.bubble.classList.remove('is-pending');
    assistantView.bubble.classList.add('is-error');
    assistantView.answerBody.textContent = `请求失败：${error.message}`;
  } finally {
    sendBtnEl.disabled = false;
    inputEl.disabled = false;
    modelSelectEl.disabled = false;
    composerTipEl.textContent = 'Enter 发送，Shift + Enter 换行';
    inputEl.focus();
    autoResizeTextarea();
  }
}

composerEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = inputEl.value.trim();
  if (!message) {
    return;
  }

  inputEl.value = '';
  autoResizeTextarea();
  await sendMessage(message);
});

inputEl.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    composerEl.requestSubmit();
  }
});

inputEl.addEventListener('input', autoResizeTextarea);

modelSelectEl.addEventListener('change', () => {
  activeModelPillEl.textContent = `CORE MODEL // ${modelSelectEl.value}`;
});

newChatBtnEl.addEventListener('click', () => {
  chatHistory = [];
  messagesInnerEl.innerHTML = `
    <article class="message assistant">
      <div class="avatar">AI</div>
      <div class="bubble">新的聊天已经开始。你现在可以继续和 Jarvis Local 对话了。</div>
    </article>
  `;
  scrollToBottom();
});

loadModels();
autoResizeTextarea();
