@echo off
:: 关闭命令回显，使脚本运行时不会显示执行的命令

echo Stopping Nginx...
:: 输出提示信息，告诉用户正在停止 Nginx

:: 使用相对路径，假设 nginx 文件夹与脚本同级
cd /d %~dp0nginx
:: %~dp0 获取当前脚本所在的目录路径
:: /d 参数允许切换到不同驱动器
:: 这行代码将当前目录切换到脚本所在目录下的 nginx 文件夹

:: 检查 Nginx 是否存在
if not exist "nginx.exe" (
    echo Nginx 未找到，请确保 nginx 文件夹与脚本在同一目录
    pause
    exit /b 1
)
:: 检查当前目录下是否存在 nginx.exe
:: 如果不存在，输出错误信息并暂停，然后退出脚本
:: exit /b 1 表示以错误状态退出（1 表示错误）

:: 停止 Nginx
nginx.exe -s quit
:: 执行 nginx.exe 并发送 quit 信号，优雅地停止 Nginx 服务

echo Nginx stopped.
:: 输出提示信息，告诉用户 Nginx 已停止

pause
:: 暂停脚本，等待用户按任意键继续，防止窗口立即关闭