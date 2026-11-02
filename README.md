# 每日三词（dense-lexicon）

每天 3 个软件研发领域的高密度词汇：一个好词能把一整套思考压缩进几个字，帮你在设计和使用 AI 工具时想得更快、说得更准。

线上地址：<https://dense-lexicon.vercel.app>

## 每个词包含什么

- **term / termZh**：英文术语与中文名
- **定义**：一段话说清它是什么
- **压缩了什么**：这个词背后打包的概念要点
- **场景**：一个真实的工程场景
- **常见误解**：最容易被想偏的地方

每天 09:00–09:30（北京时间）更新 3 个词。

## 本地运行

需要 Node.js 20.9+。

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

常用脚本：

```bash
npm run validate     # 校验 content/days/*.json 是否符合 Schema 与一致性规则
npm run build-index  # 重新生成内容索引 content/index.json
npm run lint         # ESLint
npm run build        # 生产构建（自动先跑校验与索引生成）
```

## 内容格式

内容是本仓库的唯一事实来源：每天一个文件 `content/days/YYYY-MM-DD.json`，恰好 3 个词。完整 Schema 见 [`content/schema/day.schema.json`](content/schema/day.schema.json)，精简示例：

```json
{
  "date": "2026-11-02",
  "words": [
    {
      "id": "idempotency",
      "term": "Idempotency",
      "termZh": "幂等性",
      "domain": "distributed-systems",
      "definition": "同一个操作执行一次和执行多次，对系统状态产生的效果相同……（20–200 字）",
      "compresses": ["多次执行等效于一次", "安全重试的前提"],
      "scene": "……一个真实场景（20–200 字）",
      "misconception": "……最常见的一个误解（20–200 字）"
    }
  ]
}
```

规则要点：

- `domain` 是 10 个枚举值之一：`architecture`、`distributed-systems`、`data`、`testing`、`devops`、`observability`、`security`、`ai-engineering`、`frontend`、`process`
- `id` 必须是 `term` 的 kebab-case（小写、非字母数字连续段替换为 `-`），且全库唯一
- 文件名必须与 `date` 一致；同一天内 `termZh` 不重复
- 提交前运行 `npm run validate`，坏内容会让本地与 CI 的构建直接失败

## 许可

- 代码：[MIT](LICENSE)
- 内容：[CC BY 4.0](LICENSE-CONTENT)
