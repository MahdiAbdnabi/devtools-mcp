---
tags: [skill-creator]
max_turns: 25
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, ToolSearch]
---

I need to send customers.csv to an outside vendor. Before that: drop the full_name column contents, replace emails with consistent fake values (use seed vendor-share-2026 so it's repeatable), and mask phone numbers but keep the last 2 digits. Save the result as customers-anon.csv.

Input files: customers.csv
