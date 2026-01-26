document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');

    // 发送消息到服务器并处理流式响应
    async function* fetchStreamResponse(message) {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value);
            const lines = buffer.split('\n');
            
            // 处理除最后一行外的所有完整行
            buffer = lines.pop() || '';
            for (const line of lines) {
                if (line.trim()) {
                    yield JSON.parse(line);
                }
            }
        }
    }

    // 添加消息到聊天界面
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'assistant'}`;
        messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 处理用户输入
    async function handleUserInput() {
        const message = userInput.value.trim();
        if (!message) return;

        // 禁用输入和发送按钮
        userInput.value = '';
        userInput.disabled = true;
        sendButton.disabled = true;

        // 显示用户消息
        addMessage(message, true);

        // 显示输入指示器
        typingIndicator.style.display = 'flex';

        // 创建新的消息元素
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);

        try {
            // 流式输出响应
            let responseText = '';
            for await (const { content } of fetchStreamResponse(message)) {
                responseText += content;
                contentDiv.textContent = responseText;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        } catch (error) {
            console.error('Error:', error);
            contentDiv.textContent = '发生错误，请稍后重试';
        } finally {
            // 隐藏输入指示器
            typingIndicator.style.display = 'none';
        }

        // 重新启用输入和发送按钮
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }

    // 事件监听器
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });

    // 初始化焦点
    userInput.focus();
});
