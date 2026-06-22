# Dongshan Xiamen Budget Trip

一个沈阳出发，前往东山岛和厦门的 4–5 天穷游攻略网站。

## Features

- 4 天 / 5 天行程切换
- 东山岛 + 厦门交通指南
- 预算估算表
- 自定义预算计算器
- 拍照打卡点
- 行李清单，支持 localStorage 保存勾选状态
- GitHub Pages 部署支持

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React
- Vercel Functions（可选，用于智能编辑后台）

## Project Structure

```text
dongshan-xiamen-budget-trip/
├── README.md
├── LICENSE
├── package.json
├── index.html
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── data/
│   │   ├── itinerary.js
│   │   ├── budget.js
│   │   └── tips.js
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── RouteOverview.jsx
│   │   ├── ItineraryCard.jsx
│   │   ├── BudgetTable.jsx
│   │   ├── TransportGuide.jsx
│   │   ├── FoodGuide.jsx
│   │   ├── PhotoSpots.jsx
│   │   ├── Tips.jsx
│   │   └── Footer.jsx
│   └── styles/
│       └── index.css
└── public/
    └── images/
        └── hero-dongshan-xiamen.png
```

## Getting Started

```bash
npm install
npm run dev
```

Vite 默认会在本地输出开发地址，通常是 `http://localhost:5173`。

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Deploy

可部署到 GitHub Pages。项目已经包含 GitHub Actions 部署配置：

```text
.github/workflows/deploy.yml
```

首次启用：

1. 打开 GitHub 仓库的 `Settings`。
2. 进入 `Pages`。
3. 在 `Build and deployment` 里把 `Source` 设置为 `GitHub Actions`。
4. 推送到 `main` 分支后，GitHub 会自动运行部署。

部署完成后，页面地址通常是：

```text
https://<你的用户名>.github.io/<仓库名>/
```

也可以手动本地构建：

```bash
npm run build
```

当前 `vite.config.js` 使用 `base: './'`，适合部署到 GitHub Pages 的仓库子路径。

## Smart Editing Backend

项目也包含一个可选的智能编辑后台雏形，适合部署到 Vercel：

- `/api/suggest`：管理员请求搜索 + AI 修改建议
- `/api/create-pr`：把建议写入 `content/proposals/` 并创建 GitHub Pull Request
- 访问 `?admin=1` 后，前端右下角显示 `智能编辑`：输入后端 URL 和管理员口令后使用

安全设计：

- OpenAI API Key、GitHub Token、管理员口令都只放在 Vercel 环境变量中。
- 前端不会打包任何密钥。
- AI 不会直接改 `main`，只创建 PR，合并前需要人工确认。

Vercel 环境变量参考 `.env.example`：

```text
ADMIN_TOKEN=change-this-admin-password
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-5.5
GITHUB_TOKEN=ghp-your-github-token-with-repo-scope
GITHUB_OWNER=Ziyuhua25
GITHUB_REPO=dongshan-budget-trip
GITHUB_BASE_BRANCH=main
ALLOWED_ORIGIN=https://ziyuhua25.github.io
```

部署方式：

1. 在 Vercel 导入这个 GitHub 仓库。
2. Framework 选择 Vite。
3. 填入上面的环境变量。
4. 部署完成后，用 `https://ziyuhua25.github.io/dongshan-budget-trip/?admin=1` 打开管理员入口。
5. 把 Vercel 域名填到网站右下角 `智能编辑` 面板的 `后端 API URL`。
6. `管理员口令` 填你设置的 `ADMIN_TOKEN`。

## Content Notes

旅行信息集中放在 `src/data/`：

- `itinerary.js`：路线、交通、住宿、吃饭、咖啡店关键词、打包清单
- `budget.js`：预算表和计算器默认值
- `tips.js`：拍照点和避坑提醒

后续要补照片，可以把图片放到 `public/images/`，再在组件或数据文件里引用。

## License

MIT
