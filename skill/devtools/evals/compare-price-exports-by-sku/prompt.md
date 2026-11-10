---
tags: [skill-creator]
max_turns: 25
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, ToolSearch]
---

Two price exports from our shop, before.json and after.json. What actually changed? Products should be matched by sku, not by position, and ignore the lastUpdated field, it always changes.

Input files: before.json, after.json
