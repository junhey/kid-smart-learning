# 部署配置指南 - Vercel 自动部署

## ❌ 当前问题

```
Error: Input required and not supplied: vercel-token
```

这个错误表示 GitHub Actions 没有找到必需的 Vercel 配置。需要一次性配置 GitHub Secrets。

## ✅ 解决方案

### 步骤 1：获取 Vercel Token

1. 访问 [Vercel Dashboard](https://vercel.com/account/tokens)
2. 点击 **Create Token**
3. 输入 Token 名称（例如：`kid-smart-learning-deploy`）
4. 选择 **Scope**：Full Account
5. 点击 **Create**
6. 复制生成的 Token（只会显示一次！）

### 步骤 2：获取 Vercel 项目信息

#### 方法 A：通过 Vercel CLI（推荐）

```bash
# 1. 安装 Vercel CLI（如果还没安装）
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目目录下运行
cd kid-smart-learning
vercel link

# 4. 查看项目配置
cat .vercel/project.json
```

你会看到类似这样的输出：

```json
{
  "projectId": "prj_xxxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxxx"
}
```

#### 方法 B：从 Vercel Dashboard 获取

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **General**
4. 复制 **Project ID**
5. 进入你的团队/个人设置，复制 **Team ID** (或 User ID)

### 步骤 3：在 GitHub 添加 Secrets

1. 打开你的 GitHub 仓库：
   ```
   https://github.com/junhey/kid-smart-learning
   ```

2. 进入 **Settings** → **Secrets and variables** → **Actions**

3. 点击 **New repository secret**，依次添加三个 Secrets：

   #### Secret 1: VERCEL_TOKEN
   - **Name**: `VERCEL_TOKEN`
   - **Value**: 步骤 1 中复制的 Token

   #### Secret 2: VERCEL_ORG_ID
   - **Name**: `VERCEL_ORG_ID`
   - **Value**: 步骤 2 中获取的 `orgId`

   #### Secret 3: VERCEL_PROJECT_ID
   - **Name**: `VERCEL_PROJECT_ID`
   - **Value**: 步骤 2 中获取的 `projectId`

### 步骤 4：验证配置

配置完成后，重新触发 GitHub Actions：

#### 方法 A：重新推送代码

```bash
git commit --allow-empty -m "chore: trigger deployment"
git push origin feature/ui-upgrade-2.0
```

#### 方法 B：手动触发（如果配置了）

在 GitHub Actions 页面点击 **Run workflow**

## 📝 配置示例

### GitHub Secrets 应该是这样的：

| Name | Value (示例) |
|------|-------------|
| `VERCEL_TOKEN` | `aBcDeFgHiJkLmNoPqRsTuVwXyZ...` |
| `VERCEL_ORG_ID` | `team_1a2b3c4d5e6f7g8h9i0j` |
| `VERCEL_PROJECT_ID` | `prj_9z8y7x6w5v4u3t2s1r0q` |

## 🚀 部署工作流说明

配置完成后，自动部署将按以下规则触发：

### Production 部署
- **触发条件**: 推送到 `main` 分支
- **部署环境**: Vercel Production
- **URL**: https://kid-smart-learning.vercel.app

### Preview 部署
- **触发条件**: 创建或更新 Pull Request
- **部署环境**: Vercel Preview
- **URL**: https://kid-smart-learning-xxx.vercel.app

## 🔒 安全提示

1. **永远不要**将 Token 提交到代码仓库
2. **永远不要**在公开的 Issue 或 PR 中粘贴 Token
3. Token 泄露后立即在 Vercel 删除并重新生成
4. 定期轮换 Token（建议每 3-6 个月）

## 🛠️ 故障排查

### 问题 1：Token 无效

**错误信息**: `Invalid token` 或 `Authentication failed`

**解决方案**:
1. 检查 Token 是否正确复制（没有多余空格）
2. 在 Vercel Dashboard 重新生成 Token
3. 更新 GitHub Secret

### 问题 2：项目 ID 不匹配

**错误信息**: `Project not found` 或 `Permission denied`

**解决方案**:
1. 确认 `VERCEL_PROJECT_ID` 和 `VERCEL_ORG_ID` 正确
2. 确认 Token 有访问该项目的权限
3. 运行 `vercel link` 重新链接项目

### 问题 3：构建失败

**错误信息**: `Build failed` 或 `Type check failed`

**解决方案**:
1. 在本地运行 `npm run build` 确保能成功构建
2. 在本地运行 `npm run lint` 修复代码问题
3. 在本地运行 `npx tsc --noEmit` 修复类型错误

## 📚 相关文档

- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel Action 文档](https://github.com/amondnet/vercel-action)

## 🆘 需要帮助？

如果配置过程中遇到问题，请：

1. 检查本文档的故障排查部分
2. 查看 GitHub Actions 运行日志获取详细错误信息
3. 检查 Vercel Dashboard 的部署日志

---

**创建日期**: 2026-03-25  
**最后更新**: 2026-03-25
