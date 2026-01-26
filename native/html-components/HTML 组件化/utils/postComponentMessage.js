/**
 * 在指定的 object 组件加载完成后发送消息
 * @param {string} componentId - 目标 object 组件的 ID
 * @param {any} message - 需要发送的消息内容
 * @param {string} [targetOrigin='*'] - 消息发送的目标源，默认允许所有来源（建议指定具体域名）
 */
function postComponentMessage(componentId, message, targetOrigin = '*') {
    if (typeof componentId !== 'string' || !componentId.trim()) {
        console.error('Invalid componentId: Expected a non-empty string.');
        return;
    }
    if (message === undefined) {
        console.error('Message cannot be undefined.');
        return;
    }

    const component = document.getElementById(componentId);
    if (!component) {
        console.error(`Component with ID "${componentId}" not found.`);
        return;
    }

    /**
     * 处理 object 加载完成后的消息发送
     * @param {Event} event - load 事件对象
     */
    const handleLoad = (event) => {
        const object = event.target;
        if (object?.contentWindow) {
            object.contentWindow.postMessage(message, targetOrigin);
        } else {
            console.error(`Failed to access contentWindow of component "${componentId}".`);
        }
    };

    // 监听 load 事件，并确保只执行一次
    component.addEventListener('load', handleLoad, { once: true });

    // 如果 object 已经加载完成，则立即发送消息
    if (component.contentWindow) {
        component.contentWindow.postMessage(message, targetOrigin);
    }
}
