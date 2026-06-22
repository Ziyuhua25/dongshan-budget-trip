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

## Content Notes

旅行信息集中放在 `src/data/`：

- `itinerary.js`：路线、交通、住宿、吃饭、咖啡店关键词、打包清单
- `budget.js`：预算表和计算器默认值
- `tips.js`：拍照点和避坑提醒

后续要补照片，可以把图片放到 `public/images/`，再在组件或数据文件里引用。

## License

MIT
