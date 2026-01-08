
# 项目计划书与实现路线手册 (Conjugaison Puzzle)

## 1. 对话与变更总结 (Conversation Summary)
*   **UI 重构 (最新)**:
    *   **拼图区域 (Drop Zones)**: 确立了**水平居中**的统一布局。根据时态类型（简单/复合）和动词规则性（是否拆分词尾），动态渲染 1 到 4 个拼图坑位。
        *   *逻辑示例*: 复合时态规则助动词 = 3坑 (AuxStem + VerbStem + VerbEnding)；简单时态不规则动词 = 1坑 (Stem)。
    *   **候选项区域 (Tray)**: 采用了**4列独立布局** (Aux Stem, Aux Ending, Verb Stem, Verb Ending)。
        *   四组水平并排居中，组内垂直排列。
        *   **智能显示**: 仅当对应的拼图坑位存在时（例如有 `correct_ending`），才显示对应的候选项列。
    *   **DropZone 组件**: 增强了视觉形态，支持 `left` (左半圆)、`right` (右半圆)、`single` (全圆角) 模式，实现完美的水平拼接视觉效果。
*   **问题解决**: 修复了 `@/LanguageContext` 模块解析错误，统一使用相对路径。
*   **架构升级**: 数据库迁移到 **PostgreSQL JSONB** 架构，简化了多语言字段 (`translations`) 的存储。
*   **数据逻辑**: 引入 `pronoun` 字段处理缩合 (Elision, 如 "J'")，并在数据库层面支持助动词的拆分逻辑。

## 2. 技术架构

### 2.1 前端 (Web App)
*   **i18n**: `LanguageContext` + `locales.ts` 提供 UI 文本翻译。
*   **组件设计**: 
    *   `DropZone`: 负责接收拖拽，根据位置 (`position`) 渲染不同边框和圆角。
    *   `PuzzlePiece`: 可拖拽的拼图块，根据类型 (`stem`/`ending`) 渲染凹凸缺口视觉。
*   **数据消费**: 直接从 Supabase 读取包含 JSONB 的对象，根据当前 `language` 状态提取对应文本。

### 2.2 数据库 (Supabase - JSONB)
极简 2 表设计，利用 Postgres 的 JSONB 能力：
*   `verbs`:
    *   `id`: UUID
    *   `infinitive`: Text
    *   `translations`: JSONB (例: `{"zh": "吃", "en": "eat"}`)
*   `puzzles`:
    *   `verb_id`: FK
    *   `tense`: Text
    *   `person`: Text (标准人称，如 "Je")
    *   `pronoun`: Text (显示用代词，如 "J'", "Que je", "Qu'il")
    *   `aux_stem`, `aux_ending`: Text (助动词拆分)
    *   `correct_stem`, `correct_ending`: Text (分词/主变位)
    *   `explanation_translations`: JSONB (例: `{"zh": "...", "en": "..."}`)

### 2.3 数据管道 (Offline)
1.  `scripts/generate_dataset.js`: AI 生成深层嵌套的 JSON 数据。
2.  `scripts/json_to_csv.js`: 扁平化 JSON 为 CSV，准备导入 Supabase。

## 3. 下一步操作 (Action Items)

1.  **执行 SQL**: 复制本文档第 4 节的代码，在 Supabase SQL Editor 运行，重置数据库。
2.  **生成数据**: 本地运行 `node scripts/generate_dataset.js`。
3.  **转换格式**: 本地运行 `node scripts/json_to_csv.js`。
4.  **导入数据**: 在 Supabase 后台导入生成的 `verbs.csv` 和 `puzzles.csv`。

---

## 4. 数据库初始化脚本 (Supabase SQL)

请复制以下代码并在 Supabase SQL Editor 中点击 "Run"。这将删除旧表并创建支持 JSONB 的新结构。

```sql
-- 1. 清理旧表 (Drop existing tables)
DROP TABLE IF EXISTS user_history;
DROP TABLE IF EXISTS puzzles;
DROP TABLE IF EXISTS verbs;

-- 2. 创建 Verbs 表 (支持 JSONB)
CREATE TABLE verbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  infinitive TEXT NOT NULL,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb, -- 存储格式: { "en": "eat", "zh": "吃" }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 创建 Puzzles 表 (支持 JSONB + 复合时态逻辑)
CREATE TABLE puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verb_id UUID REFERENCES verbs(id) ON DELETE CASCADE,
  tense TEXT NOT NULL,
  person TEXT NOT NULL, -- 标准人称: "Je", "Tu", "Il" (用于排序/过滤)
  pronoun TEXT NOT NULL, -- 显示人称: "J'", "Qu'il" (用于 UI 显示)
  is_regular BOOLEAN DEFAULT TRUE,

  -- 核心变位部分 (Main Verb / Participle)
  correct_stem TEXT NOT NULL,
  correct_ending TEXT, -- 可能为空 (如部分不规则变位)
  distractor_stems TEXT[] DEFAULT '{}',
  distractor_endings TEXT[] DEFAULT '{}',

  -- 助动词部分 (Auxiliary - 仅用于复合时态)
  aux_stem TEXT,
  aux_ending TEXT,
  distractor_aux_stems TEXT[] DEFAULT '{}',
  distractor_aux_endings TEXT[] DEFAULT '{}',

  rule_summary TEXT,
  
  -- 解释翻译 JSONB
  explanation_translations JSONB NOT NULL DEFAULT '{}'::jsonb, -- 存储格式: { "en": "...", "zh": "..." }

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 启用安全性 (Row Level Security)
ALTER TABLE verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;

-- 5. 允许公开读取 (Allow Public Read)
-- 因为这是个公共学习应用，我们需要允许匿名用户读取数据
CREATE POLICY "Allow public read access on verbs" 
ON verbs FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public read access on puzzles" 
ON puzzles FOR SELECT 
TO anon, authenticated 
USING (true);

-- 6. 创建索引 (提升随机查询性能)
CREATE INDEX idx_puzzles_verb_id ON puzzles(verb_id);
CREATE INDEX idx_puzzles_tense ON puzzles(tense);
```

测试数据
