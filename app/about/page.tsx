import type { Metadata } from "next";

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
        内容由 Jason
        与他的助手维护，代码与内容开源在{" "}
        <a href="https://github.com/jason1105/dense-lexicon">GitHub</a>。
      </p>
    </div>
  );
}
