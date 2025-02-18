const express = require('express');
const cors = require('cors');
const app = express();

// 启用CORS和JSON解析中间件
app.use(cors());
app.use(express.json());

// 模拟流式响应的辅助函数
async function* generateResponse(message) {
    const responses = [
        `我收到了你的消息："${message}"
让我想想...`,
        '这是一个很有趣的问题！让我们深入探讨一下这个话题。首先，我们需要理解问题的本质，然后再一步步地分析可能的解决方案。这个过程可能需要一些时间，但我相信通过我们的讨论，一定能够找到最佳答案。',
        '根据我的理解，这个问题可以从多个角度来分析。第一，我们要考虑问题的背景和具体场景。第二，我们需要评估各种可能的解决方案。第三，我们还要权衡每种方案的优劣势。最后，我们才能得出一个合理的结论。',
        '这个问题确实很有深度！它让我想到了很多相关的观点和理论。不过，在给出具体建议之前，我觉得我们可以先讨论一下你对这个问题的具体想法。这样我们的交流会更有针对性，也能帮助我提供更准确的建议。',
        '说实话，这是一个非常棒的问题！它涉及到了很多有趣的方面。让我们一起来探索这个问题，相信通过我们的讨论，不仅能找到答案，还能发现更多有价值的见解。'
    ];
    
    // 随机选择一个回复
    const response = responses[Math.floor(Math.random() * responses.length)];
    const segments = response.split(/([,.!?。：])/); // 按标点符号分割
    
    let id = 0;
    // 模拟更自然的打字效果
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const chars = segment.split('');
        
        for (const char of chars) {
            // 模拟打字速度变化
            await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 30));
            yield JSON.stringify({id: id++, content: char});
        }
        
        if (i < segments.length - 1) {
            // 在标点符号后添加稍长的停顿
            yield JSON.stringify({id: id++, content: segments[i + 1]}); // 输出标点符号
            i++; // 跳过下一个循环中的标点符号
            await new Promise(resolve => setTimeout(resolve, 300)); // 标点符号后的停顿
        }
    }
}

// 处理聊天请求的路由
app.post('/chat', async (req, res) => {
    const { message } = req.body;
    
    // 设置响应头，启用流式传输
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // 生成并发送流式响应
    for await (const chunk of generateResponse(message)) {
        res.write(chunk + '\n'); // 每个JSON对象后添加换行符
    }
    
    res.end();
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});