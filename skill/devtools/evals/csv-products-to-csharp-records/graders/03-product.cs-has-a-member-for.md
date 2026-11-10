---
type: llm
focus: trace
weight: 1
---

Product.cs has a member for each of the five CSV columns (sku, name, unit_price, in_stock, reorder_level), and maps each member to its CSV column name for System.Text.Json (for example JsonPropertyName("unit_price"))
