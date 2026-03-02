---
name: ralph-loop
description: "Start Ralph Wiggum loop - 동일 프롬프트를 반복 실행하는 자기참조 반복 개발 루프를 시작합니다."
argument-hint: "PROMPT [--max-iterations N] [--completion-promise TEXT]"
allowed-tools: ["Bash(.claude/plugins/ralph-wiggum/scripts/setup-ralph-loop.sh:*)"]
---

# Ralph Loop Command

Execute the setup script to initialize the Ralph loop:

```!
".claude/plugins/ralph-wiggum/scripts/setup-ralph-loop.sh" $ARGUMENTS
```

Please work on the task. When you try to exit, the Ralph loop will feed the SAME PROMPT back to you for the next iteration. You'll see your previous work in files and git history, allowing you to iterate and improve.

CRITICAL RULE: If a completion promise is set, you may ONLY output it when the statement is completely and unequivocally TRUE. Do not output false promises to escape the loop, even if you think you're stuck or should exit for other reasons. The loop is designed to continue until genuine completion.
