# AGENTS.md

Hướng dẫn AI coding agent (OpenCode) khi làm việc với project này.

## Tổng quan

Project **UXcomic** — website truyện tranh UX, built với Angular 20, Tailwind CSS.

Agent-skills được cài đặt tại `agent-skills/` với 24 skills engineering. Skills được symlink vào `.opencode/skills/` để OpenCode auto-discover.

Agents (personas) được symlink vào `.opencode/agents/` và commands (slash commands) được cấu hình tại `.opencode/commands/`.

## OpenCode Integration

OpenCode dùng mô hình **skill-driven execution** qua `skill` tool và thư mục `.opencode/skills/`.

### Core Rules

- Nếu task match một skill, bạn PHẢI invoke nó
- Skills nằm tại `.opencode/skills/<skill-name>/SKILL.md`
- Không được implement trực tiếp nếu có skill áp dụng
- Luôn làm theo skill instructions một cách chính xác

### Project Context

- Framework: Angular 20
- Styling: Tailwind CSS
- Package manager: pnpm
- SSR: Angular SSR
- Format: Prettier (`pnpm prettier`)
- Test: Karma (`pnpm test`)

### Intent → Skill Mapping

| Intent | Skill |
|--------|-------|
| Feature / chức năng mới | `spec-driven-development` → `incremental-implementation` + `test-driven-development` |
| Planning / breakdown | `planning-and-task-breakdown` |
| Bug / lỗi | `debugging-and-error-recovery` |
| Code review | `code-review-and-quality` |
| Refactoring / simplification | `code-simplification` |
| API / interface design | `api-and-interface-design` |
| UI work / component | `frontend-ui-engineering` |
| Security review | `security-and-hardening` |
| Performance | `performance-optimization` |
| Git / commit | `git-workflow-and-versioning` |
| CI/CD | `ci-cd-and-automation` |

### Slash Commands

OpenCode hỗ trợ slash commands qua `.opencode/commands/`:

| Command | Mô tả |
|---------|-------|
| `/spec` | Viết specification trước code |
| `/plan` | Chia task nhỏ với acceptance criteria |
| `/build` | Implement incremental; `/build auto` chạy full plan |
| `/test` | TDD: RED → GREEN → REFACTOR |
| `/review` | Five-axis review |
| `/code-simplify` | Đơn giản hóa code |
| `/webperf` | Web performance audit |
| `/ship` | Pre-launch checklist với parallel fan-out personas |

### Lifecycle Mapping

Ngoài slash commands, agent cũng tự động map lifecycle qua intent:

| Phase | Skill |
|-------|-------|
| DEFINE | `spec-driven-development` |
| PLAN | `planning-and-task-breakdown` |
| BUILD | `incremental-implementation` + `test-driven-development` |
| VERIFY | `debugging-and-error-recovery` |
| REVIEW | `code-review-and-quality` |
| SHIP | `shipping-and-launch` |

### Execution Model

Với mỗi request:

1. Xác định skill nào áp dụng (dù chỉ 1% khả năng)
2. Invoke skill bằng `skill` tool
3. Làm theo workflow trong skill một cách chính xác
4. Chỉ implement sau khi hoàn thành các bước bắt buộc

### Anti-Rationalization

Các suy nghĩ sau là SAI và phải bỏ qua:

- "Cái này nhỏ quá không cần skill"
- "Tôi tự implement nhanh được"
- "Để tôi đọc context trước"

Hành vi đúng: **Luôn kiểm tra và dùng skills trước**.

## Agent Personas

Các personas có sẵn tại `agent-skills/agents/`:

- `code-reviewer` — Senior Staff Engineer review
- `test-engineer` — QA Specialist
- `security-auditor` — Security Engineer
- `web-performance-auditor` — Web Performance Engineer

## Commands Reference

Các commands có sẵn:

| Command | Mô tả |
|---------|-------|
| `/spec` | Viết specification trước code |
| `/plan` | Chia task nhỏ với acceptance criteria |
| `/build` | Implement incremental; `/build auto` chạy full plan |
| `/test` | TDD: RED → GREEN → REFACTOR |
| `/review` | Five-axis review |
| `/code-simplify` | Đơn giản hóa code |
| `/webperf` | Web performance audit |
| `/ship` | Pre-launch checklist với parallel fan-out personas |

> Trên OpenCode, các command này được hỗ trợ native qua `.opencode/commands/`. Ngoài ra, agent cũng tự động map intent sang skill tương ứng.
