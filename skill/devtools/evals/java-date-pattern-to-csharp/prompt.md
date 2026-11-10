---
tags: [skill-creator]
max_turns: 25
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, ToolSearch]
---

Our Java billing service writes timestamps with DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX"). The new .NET reconciliation job has to write exactly the same strings so the two can be matched. What custom format string do I use in C#, and is there anything that won't come out identical?
