// 导入electron中的app和BrowserWindow模块
// app 控制应用程序的事件生命周期
// BrowserWindow 创建和管理应用程序窗口
const { app, BrowserWindow } = require('electron')

// 创建窗口的函数
const createWindow = () => {
    // 创建一个新的浏览器窗口实例
    const win = new BrowserWindow({
        width: 800,        // 设置窗口宽度为800像素
        height: 600        // 设置窗口高度为600像素
    })

    // 加载index.html文件到窗口中
    win.loadFile('index.html')
}

// 当Electron完成初始化时执行
app.whenReady().then(() => {
    // 调用创建窗口的函数
    createWindow()
})