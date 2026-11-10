---
tags: [skill-creator]
max_turns: 25
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, ToolSearch]
---

We get products.csv from the supplier every night. Our import job turns each row into JSON and deserializes it with System.Text.Json. Can you give me C# records for one row? Namespace Shop.Catalog, root type Product. Keep real types for the numbers and the true/false column, not strings everywhere. Save it as Product.cs.

Input files: products.csv
