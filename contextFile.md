一、 项目共识 (Consensus)
产品定位：一款寓教于乐的法语动词变位拼图游戏，旨在通过“词根+词尾”的视觉解构，帮助学习者理解变位逻辑，而非死记硬背。
数据策略：
离线生成，在线存储：放弃昂贵的客户端实时 AI 生成，改为使用 Google Gemini 离线生成 84 个核心变位（14种时态 × 6个人称），存储在 Supabase。
多语言支持：界面和语法解析全面支持 法、英、中、日 四种语言。
UI/UX 准则：
法式美学：使用法国国旗三原色（Blue, White, Red）作为视觉基调。
移动优先：针对小屏幕优化了拼图块的排列逻辑（Smart Tray）。
反馈即时：通过颜色（绿/红）和动画提供即时的对错反馈。
二、 已完成的核心代码逻辑 (Completed Logic)
动态布局引擎 (Smart Tray)：
内容自适应：自动测量文本宽度，根据容器空间计算托盘列数（1列、2列或4列）。
双组隔离：复合时态下，助动词组（Amber）与动词组（Blue）视觉分离，逻辑互不干扰。
严格拖拽校验：
通过 application/x-puzzle-type 确保词根只能填入词根槽位，词尾只能填入词尾槽位。
多模态变位处理：
简单时态：2 槽位逻辑（Radical + Terminaison）。
复合时态：4 槽位逻辑（Aux Stem + Aux End + Participle Stem + Participle End）。
特殊情况：支持不规则动词的“整块”模式（Ending 为 Null 时，Stem 占据单槽位）。
引导与教学系统：
TutorialOverlay：基于 getBoundingClientRect 的动态遮罩引导系统。
GrammarModal：基于 locales.ts 的可折叠语法规则手册。
自动化测试套件 (Vitest)：
涵盖了从 Utils 函数到 Context 状态管理，再到 App 集成流程的 8 个测试套件。
三、 核心参数与数据结构 (Core Parameters)
1. 核心接口 (types.ts)
PuzzleData：前端使用的标准对象，包含 pronoun（处理省音如 J'）、correctStem、correctEnding 等。
DatabasePuzzle：Supabase 存储结构，利用 JSONB 存储多语言 explanation_translations。
2. 关键时态列表 (constants.ts)
支持 14 种时态，涵盖直陈式（Present, Imparfait, Futur...）、条件式、虚拟式以及所有对应的复合时态。
3. 翻译字典 (locales.ts)
UI 字符串：所有按钮、标签、提示语。
语法规则：每种时态的标题、公式、详细描述和例句。
4. 样式规范 (index.html / Tailwind)
颜色定义：
french-blue: #0055A4 (主色调/词根)
french-red: #EF4135 (错误反馈/动词)
amber: 助动词专用色
形状剪裁：使用 clip-path 实现拼图块的凹凸连接视觉效果。
四、 后续开发建议
数据填充：目前数据库已配置好，可以继续通过 scripts/generate_dataset.js 生成更多动词（如 prendre, vouloir）并导入。
成就系统：可以在 user_history 表中记录用户的错题，实现“错题本”功能。
音效：加入拼图吸附时的“咔哒”声，提升交互沉浸感。