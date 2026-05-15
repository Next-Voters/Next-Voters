Analyze all pending changes and use judgement to commit them as one or multiple commits. Follow these steps:

1. Run these in parallel to understand the full picture:
   - `git status` to see all changed, staged, and untracked files
   - `git diff` to see unstaged changes
   - `git diff --cached` to see already-staged changes
   - `git log --oneline -10` to match the repo's commit style

2. If there are no changes, tell me and stop.

3. Analyze every changed file and categorize them by **logical unit of work**. Consider:
   - Do the changes touch the same feature, bug fix, or concern?
   - Are there unrelated changes mixed together (e.g., a bug fix + a new feature + a config change)?
   - Would a reviewer understand the intent better with one commit or several?
   - Are there changes that are purely mechanical (formatting, renames, dependency bumps) vs. substantive?

4. Decide: **one commit or many?**
   - **One commit** when: all changes serve a single purpose, or they're small and tightly coupled.
   - **Multiple commits** when: there are clearly distinct concerns (e.g., a refactor AND a new feature, or a bug fix AND an unrelated config change). Each commit should be a self-contained, meaningful unit.

5. For each commit (whether one or many), in order:
   a. Stage only the files belonging to that logical group using specific file names (never `git add .` or `git add -A`). Do NOT stage files that likely contain secrets (`.env`, credentials, keys) — warn me if any are present.
   b. Run `git diff --cached` to review what's staged.
   c. Write a concise commit message (1-2 sentences) that describes **why** the change was made, following the style of recent commits. End with:
      `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
   d. Create the commit using a HEREDOC for the message.

6. After all commits are created, run `git log --oneline -10` and report:
   - How many commits were created and why you chose that grouping
   - The hash and message of each new commit

7. Do NOT push these commits. Engineer will use bash command to manually do it when needed. 