@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ================================
echo    心晴日记 - Sunny Diary
echo ================================
echo.

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址：https://nodejs.org
    pause
    exit /b 1
)

:: 检查依赖是否已安装
if not exist "node_modules\" (
    echo 首次运行，正在安装项目依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败，请检查网络连接后重试
        pause
        exit /b 1
    )
    echo 依赖安装完成！
    echo.
)

echo 正在启动开发服务器...
echo 服务器就绪后浏览器将自动打开
echo.

call npm run dev -- --open

pause