# Mock 模式说明

通过 URL 参数切换不同的 UI 状态，无需连接 Supabase 数据库。

## 使用方式

| URL 参数 | 效果 |
|---|---|
| `?mock` | Mock 数据，正常游戏流程 |
| `?mock=loading` | 永远停留在 LOADING 页面 |
| `?mock=error` | 触发 ERROR 页面 |
| 无参数 | 连 Supabase 真实数据 |

## 实现原理

- **`services/supabase.ts`** — 检测 URL `?mock` 参数，拦截 `fetchPuzzleBatch`
  - `?mock=loading` → 返回永不 resolve 的 Promise，状态停在 LOADING
  - `?mock=error` → 返回空数组，触发 ERROR 状态
  - `?mock` → 返回本地 mock 数据
- **`services/mockData.ts`** — 4 个 mock puzzle，覆盖不同场景：
  - 简单时态 + 有 example（choisir）
  - 复合时态 + 有 example（savoir）
  - 简单时态 + 无 example（parler）
  - être 助动词复合时态 + 有 example（partir）
