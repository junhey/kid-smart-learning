#!/bin/bash

# Vercel 部署配置助手
# 用于快速获取 Vercel 项目配置信息

echo "🚀 Vercel 部署配置助手"
echo "======================="
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未检测到 Vercel CLI"
    echo ""
    echo "请先安装 Vercel CLI："
    echo "  npm install -g vercel"
    echo ""
    echo "或者使用 npx："
    echo "  npx vercel --version"
    exit 1
fi

echo "✅ Vercel CLI 已安装"
echo ""

# 检查是否已登录
echo "📝 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "❌ 未登录 Vercel"
    echo ""
    echo "请先登录："
    echo "  vercel login"
    exit 1
fi

VERCEL_USER=$(vercel whoami 2>/dev/null)
echo "✅ 已登录为: $VERCEL_USER"
echo ""

# 检查是否已链接项目
if [ ! -f ".vercel/project.json" ]; then
    echo "❌ 项目未链接到 Vercel"
    echo ""
    echo "正在链接项目..."
    vercel link
    echo ""
fi

# 读取项目配置
if [ -f ".vercel/project.json" ]; then
    echo "✅ 项目已链接"
    echo ""
    
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
    ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
    
    echo "📋 项目配置信息："
    echo "=================="
    echo ""
    echo "VERCEL_PROJECT_ID:"
    echo "  $PROJECT_ID"
    echo ""
    echo "VERCEL_ORG_ID:"
    echo "  $ORG_ID"
    echo ""
    echo "=================="
    echo ""
    
    # 生成 GitHub Secrets 配置指令
    echo "🔑 GitHub Secrets 配置步骤："
    echo "============================="
    echo ""
    echo "1. 获取 Vercel Token："
    echo "   访问: https://vercel.com/account/tokens"
    echo "   创建一个新 Token 并复制"
    echo ""
    echo "2. 在 GitHub 仓库添加以下 Secrets："
    echo "   访问: https://github.com/junhey/kid-smart-learning/settings/secrets/actions"
    echo ""
    echo "   添加 Secret 1："
    echo "   Name:  VERCEL_TOKEN"
    echo "   Value: <你的 Vercel Token>"
    echo ""
    echo "   添加 Secret 2:"
    echo "   Name:  VERCEL_ORG_ID"
    echo "   Value: $ORG_ID"
    echo ""
    echo "   添加 Secret 3:"
    echo "   Name:  VERCEL_PROJECT_ID"
    echo "   Value: $PROJECT_ID"
    echo ""
    echo "============================="
    echo ""
    
    # 保存配置到文件
    cat > .vercel-config.txt << EOF
# Vercel 部署配置信息
# 生成时间: $(date)
# 用户: $VERCEL_USER

VERCEL_PROJECT_ID=$PROJECT_ID
VERCEL_ORG_ID=$ORG_ID

# 请访问以下链接获取 VERCEL_TOKEN:
# https://vercel.com/account/tokens

# GitHub Secrets 配置地址:
# https://github.com/junhey/kid-smart-learning/settings/secrets/actions
EOF
    
    echo "💾 配置信息已保存到: .vercel-config.txt"
    echo ""
    echo "⚠️  注意: 请不要将 .vercel-config.txt 提交到 Git!"
    echo ""
    
    # 添加到 .gitignore
    if ! grep -q ".vercel-config.txt" .gitignore 2>/dev/null; then
        echo ".vercel-config.txt" >> .gitignore
        echo "✅ 已将 .vercel-config.txt 添加到 .gitignore"
    fi
    
else
    echo "❌ 无法读取项目配置"
    echo ""
    echo "请手动运行："
    echo "  vercel link"
    exit 1
fi

echo ""
echo "🎉 配置完成！"
echo ""
echo "下一步："
echo "1. 获取 Vercel Token: https://vercel.com/account/tokens"
echo "2. 在 GitHub 添加 Secrets: https://github.com/junhey/kid-smart-learning/settings/secrets/actions"
echo "3. 重新触发部署: git push"
