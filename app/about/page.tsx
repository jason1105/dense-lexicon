import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "关于" };

export default function AboutPage() {
  return (
    <div className="prose">
      <h1 className="t-title">关于</h1>
      <p>
        每日三词：每天 3 个软件研发领域的高密度词汇。一个好词能把一整套思考压缩进几个字，帮你在设计和使用
        AI 工具时想得更快、说得更准。
      </p>
      <p>
        每天 09:00–09:30（北京时间）更新。每个词包含：定义、它压缩了什么、一个真实场景、一个常见误解。
      </p>
      <p>
        每个词还带五个维度的标签——学科、工程、认知、场景、层级——刻画它来自哪里、落在哪种工程和场景、属于哪一层（定律、模式、实践……）。在
        <Link href="/tags">标签页</Link>
        可以按维度浏览全部词条。
      </p>
      <p>
        内容由 Jason
        与他的助手维护，代码与内容开源在{" "}
        <a href="https://github.com/jason1105/dense-lexicon">GitHub</a>。
      </p>
    </div>
  );
}
