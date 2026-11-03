# 每日三词（dense-lexicon）

每天 3 个软件研发领域的高密度词汇：一个好词能把一整套思考压缩进几个字，帮你在设计和使用 AI 工具时想得更快、说得更准。

线上地址：<https://dense-lexicon.vercel.app>

## 每个词包含什么

- **term / termZh**：英文术语与中文名
- **hook**：一句话记忆钩子
- **definition**：一段话说清它是什么
- **tags**：五个维度的标签——学科 / 工程 / 认知 / 场景 / 层级，每维度 1–4 个（层级 1–2 个）
- **background / problem**：它出现的背景，以及它要解决的问题
- **actors / evolution**：关键参与方与演化过程
- **compresses**：这个词背后打包的概念要点
- **scene / misconception**：一个真实场景，一个常见误解
- **relations**：相关与对立的词
- **sources**：出处

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

内容是本仓库的唯一事实来源：每天一个文件 `content/days/YYYY-MM-DD.json`，恰好 3 个词。
完整 Schema 见 [`content/schema/day.schema.json`](content/schema/day.schema.json)。
下面是节选自 [`2026-11-02.json`](content/days/2026-11-02.json) 的一个词
（省略同一天其余两词，长文本与列表有截断，不能直接通过校验）：

```json
{
  "date": "2026-11-02",
  "words": [
    {
      "id": "idempotency",
      "term": "Idempotency",
      "termZh": "幂等性",
      "domain": "distributed-systems",
      "hook": "按一次和按十次，结果一样。",
      "definition": "同一个操作执行一次和执行多次，对系统状态产生的效果相同……（20–200 字）",
      "tags": {
        "discipline": ["数学", "分布式系统"],
        "engineering": ["可靠性", "接口设计", "数据一致性"],
        "cognitive": ["不变量思维"],
        "scenario": ["接口设计", "消息消费", "代码评审"],
        "level": ["属性"]
      },
      "background": "幂等来自数学：1870 年 Benjamin Peirce 用 idempotent 描述……（20–240 字）",
      "problem": "网络超时后，客户端不知道请求有没有成功，只能重试……（20–200 字）",
      "actors": [
        "Benjamin Peirce（美国数学家）：1870 年创造 idempotent 一词",
        "……（1–5 项，形如“名称：作用”）"
      ],
      "evolution": [
        "1870：Peirce 在代数研究中提出幂等概念",
        "……（2–6 项，按时间先后，每项以时间开头）"
      ],
      "compresses": ["多次执行等效于一次", "安全重试的前提", "……（2–6 项）"],
      "scene": "在发件箱模式下，告警服务可能收到同一事件两次……（20–200 字）",
      "misconception": "以为 GET 天然幂等、POST 天然不幂等……（20–200 字）",
      "relations": {
        "related": [
          {
            "term": "Outbox Pattern",
            "termZh": "发件箱模式",
            "note": "至少一次投递，靠幂等去重"
          }
        ],
        "opposite": [
          {
            "term": "Non-idempotent Operation",
            "termZh": "非幂等操作"
          }
        ]
      },
      "sources": [
        {
          "title": "RFC 9110: HTTP Semantics §9.2.2 Idempotent Methods",
          "url": "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2"
        }
      ]
    }
  ]
}
```

规则要点：

- 标签的取值必须在 [`content/tags.json`](content/tags.json) 对应维度的词表里——词表是标签的单一来源
- `domain` 是 10 个枚举值之一：`architecture`、`distributed-systems`、`data`、`testing`、`devops`、`observability`、`security`、`ai-engineering`、`frontend`、`process`。它是内部主分类，界面不展示
- `id` 必须是 `term` 的 kebab-case（小写、非字母数字连续段替换为 `-`），且全库唯一
- `relations` 里的 `term` 经 kebab-case 后命中已收录词条时，页面自动生成链接；不能指向词条自己
- `sources` 必须是真实可访问的 http(s) 链接
- 文件名必须与 `date` 一致；同一天内 `termZh` 不重复
- 提交前运行 `npm run validate`，坏内容会让本地与 CI 的构建直接失败

## 许可

- 代码：[MIT](LICENSE)
- 内容：[CC BY 4.0](LICENSE-CONTENT)
