Commit and push all changes on the current branch. Follow these steps:

1. Run `git status` to see all changes (staged, unstaged, and untracked). Also run `git branch --show-current` to identify the current branch. Also run `git log --oneline -5` to see recent commit message style.
2. If there are no changes to commit, tell me and stop.
3. Stage all relevant changes with `git add` (use specific file names — avoid `git add .` or `git add -A`). Do NOT stage files that likely contain secrets (e.g., `.env`, `credentials.json`, etc.) — warn me if any are present.
4. Analyze the staged diff (`git diff --cached`) and write a concise commit message (1-2 sentences) that describes **why** the change was made, following the style of recent commits. End the message with:
   `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
5. Create the commit using a HEREDOC for the message.
6. Push to the remote with `git push -u origin <current-branch>`.
7. Report the commit hash and confirm the push succeeded.
