---
name: devtools
description: Exact, offline developer data tools from the DevTools MCP server (tool names like `json-xml__format-json`, often with a client prefix). Use it when the user has the data in hand, pasted or in a file they name, and wants an exact result about that data - format, minify or check JSON/XML/CSV; convert between JSON, XML, CSV and YAML; generate C# or Java classes from a sample; compare JSON/XML/CSV documents; JSONPath/XPath queries or finding a key or value; Base64, URL and HTML encoding; hashes of text or files; decoding a JWT; making or inspecting UUIDs; reading Unix timestamps; C#/Java date format patterns; exact unit conversion; anonymizing data with rules; case, diff, regex test, sort or dedupe on given text. Use it even if DevTools is not named. It is not for writing or editing code that does these things (a regex for a validator, hashing in a login handler, sorting imports), for git diffs between branches or commits, or for running the project's own formatter or linter.
license: MIT
metadata:
  version: "1.1.0"
---

# DevTools

DevTools is a local, offline toolbox exposed through MCP. Each tool is a pure, tested transformation, so its answer is exact where a hand-written answer can drift: number formatting, escaping, edge cases in XML or CSV, date tokens, unit factors. When a user's task matches a tool, call the tool and work from its output instead of transforming the data yourself.

## Find the tools

The tools come from the DevTools MCP server. Every tool is named `<plugin>__<tool>`, for example `json-xml__format-json`, and the client puts its own prefix in front, built from the name the user gave the server when they registered it. That name is often `devtools`, but it can be anything, so recognise the tools by the `<plugin>__<tool>` part:

- Claude Code: `mcp__<server name>__<plugin>__<tool>`, e.g. `mcp__devtools__json-xml__format-json`. If the tools are deferred, load them first with a tool search for the part you need, such as `json-xml__format-json` or `format-json`.
- Claude Desktop and other clients: `<plugin>__<tool>`, sometimes with the server name in front.

In this file, tools are named by the `<plugin>__<tool>` part alone.

If no such tool is available, the server is not connected. Tell the user so and point them to the setup, with the folder where they unzipped `devtools-cli`:

- Claude Code: `claude mcp add --scope user devtools -- node C:\Tools\devtools-cli\devtools.mjs mcp`
- Claude Desktop, in `claude_desktop_config.json`: `"mcpServers": { "devtools": { "command": "node", "args": ["C:\\Tools\\devtools-cli\\devtools.mjs", "mcp"] } }`

Then do the task by hand only if they want that, and say the result was not produced by DevTools.

## Choose the tool

Decide in two steps: what the input is, and what the user wants out of it. The table covers the common goals; `references/tools.md` lists every tool with all its arguments, defaults and limits, so read the entry for the tool you picked when you need an option that is not obvious.

| The user wants to... | Tool |
| --- | --- |
| Pretty-print, re-indent or minify JSON | `json-xml__format-json` (`indent`: `2`, `4`, `tab`, `none` = minify) |
| Pretty-print or minify XML | `json-xml__format-xml` |
| Convert JSON to XML / XML to JSON | `json-xml__json-to-xml` / `json-xml__xml-to-json` |
| Turn JSON or XML into CSV | `tabular__json-to-csv` / `tabular__xml-to-csv` (`rowsPath` picks the repeated array or element) |
| Turn CSV into JSON | `tabular__csv-to-json` |
| Reformat CSV (delimiter, quoting, line endings, BOM) | `tabular__format-csv` |
| Convert YAML to JSON / JSON to YAML | `text__yaml-to-json` / `text__json-to-yaml` |
| Generate C# classes or records | `codegen__json-to-csharp` / `codegen__xml-to-csharp` |
| Generate Java POJOs or records | `codegen__json-to-java` / `codegen__xml-to-java` |
| Compare JSON / XML / CSV documents (2 to 20) | `compare__json` / `compare__xml` / `compare__csv` |
| See what changed between two plain texts | `text__diff` |
| Find where a property or key name occurs | `search__find-property` |
| Find which fields hold a value | `search__find-value` |
| Run a JSONPath query / an XPath 1.0 query | `search__jsonpath` / `search__xpath` |
| Base64 of text, JSON or XML (encode or decode) | `encoding__base64` |
| Base64 of a file on disk | `encoding__base64-file` |
| MD5/SHA-1/SHA-256/SHA-512 of text / of a file | `encoding__hash` / `encoding__hash-file` |
| URL encode or decode | `encoding__url` |
| HTML entity encode or decode | `encoding__html` |
| Read a JWT (header, payload, dates) | `encoding__jwt` (it decodes, it does not verify signatures) |
| New UUIDs/GUIDs (v4, v7) / inspect existing ones | `encoding__uuid` / `encoding__uuid-inspect` |
| Unix epoch to date, or date to epoch | `encoding__timestamp` |
| Render an instant with C# format strings | `datetime__csharp` |
| Render an instant with Java `DateTimeFormatter` patterns | `datetime__java` |
| Translate a date pattern between C# and Java | `datetime__convert` (`direction`) |
| Look up what a date format specifier means | `datetime__reference` |
| Convert a quantity between units | `units__convert` (e.g. `text: "5 km to mi"`) |
| Show a quantity in every unit of its category | `units__convert-all` |
| List the supported units | `units__catalog` |
| Anonymize JSON / XML / CSV / free text | `anonymize__json` / `anonymize__xml` / `anonymize__csv` / `anonymize__text` |
| Check or normalize an anonymization rule set | `anonymize__rules` |
| Change case (camelCase, snake_case, ...) | `text__case` |
| Test a regex or replace with it | `text__regex` (`mode`, `replacement`) |
| Sort, dedupe, reverse or trim lines | `text__sort-lines`, `text__unique-lines`, `text__reverse-lines`, `text__trim-lines` |

### Close calls

These pairs look alike; the difference decides the result.

- **`compare__*` or `text__diff`.** For structured documents, use `compare__json`/`xml`/`csv`: it understands keys and arrays (`key` matches array items or CSV rows by id, `ignoreOrder` treats arrays as sets, `ignorePaths` skips volatile fields, `mode: structure` compares only shape and types). Use `text__diff` for prose, code, logs, or when the user wants a line or word diff.
- **`search__find-property`, `search__find-value`, `search__jsonpath` or `search__xpath`.** Use find-property when the user knows a key name but not where it is, and find-value when they know a value but not which field holds it. Use JSONPath or XPath when they describe a location or a filter ("all books under 10 dollars"); write the expression for them.
- **`encoding__base64` or `encoding__base64-file`, and `encoding__hash` or `encoding__hash-file`.** Use the `-file` tools when the data is a file on disk, especially binary or large files: the server reads the bytes itself. Use the text tools for pasted text.
- **`encoding__timestamp` or `datetime__*`.** Epoch numbers and ISO conversions go to `encoding__timestamp`. Questions about format strings (`yyyy-MM-dd'T'HH:mm`, `"o"`, `"R"`) go to the `datetime__` tools.
- **`units__convert` or `units__convert-all`.** Use convert-all when the user wants a quantity "in all units" or doesn't say the target unit.

### Chaining

When no single tool does the job, chain them and pass each output text to the next call:

- CSV or YAML to C# or Java classes: `tabular__csv-to-json` or `text__yaml-to-json`, then `codegen__json-to-*`.
- Anonymize, then pretty-print: `anonymize__json` with `indent`, or `json-xml__format-json` afterwards.
- Pull a subset, then convert it: `search__jsonpath`, then `tabular__json-to-csv`.

## Call it well

- **Pass data as text.** Most tools take the document in `text` (`documents` for compare, `original` and `modified` for diff). Pass the user's content exactly, without reformatting it first. Escaping, whitespace and number spelling matter, and the tool handles them.
- **Files.** Only the `-file` tools take a path (`file`). The server opens exactly that path, read-only. It never writes files: options that would write are not offered. For every other tool, when the user names a file, read it with your own file tool and pass its content as `text`. If the user wants the result saved, write it yourself after the call.
- **Options.** Leave options at their defaults unless the user asked for something. Do set the ones that their request implies:
  - `indent: "4"`;
  - `rootName` / `namespace` / `package` for code generation;
  - `style: "record"` when they ask for records;
  - `key` for compare;
  - `timezone` for timestamps and JWT dates;
  - `direction` for date-pattern conversion.

  Enum values are exact strings, so check `references/tools.md` when unsure.
- **Anonymization needs rules.** The anonymize tools do not detect sensitive data by themselves. They apply a rule set, a JSON string, that you write from what the user wants hidden. Read `references/anonymize-rules.md` for the format and examples. Validate a new rule set with `anonymize__rules` first. Ask the user for a `seed` (a secret) when they want stable pseudonyms or hashes, and don't make one up and present it as theirs.
- **Size.** A call takes up to 64 MB of text by default. For bigger inputs, tell the user rather than splitting silently.

## Read the result

The reply is one or more text items:

- the output: formatted text, CSV for tables (tables also arrive as `structuredContent`), a unified diff, or an indented tree;
- a final item of diagnostic lines such as `error: ... (line 3, column 7)`.

- **Errors.** If `isError` is true, an error diagnostic came back. Show the user the message with its line and column, fix the input or the arguments if the cause is clear, and call again. Don't present partial output as a success.
- **Warnings and info.** Keep the ones that matter to the user, for example "rule 2 matched nothing", "values that differ only in aspects the options ignore", or a lossy C#/Java pattern token. Drop routine counts unless asked.
- **Data outputs.** Give the output as the tool produced it, in a code block with the right language, rather than re-typing it. For compare and search results, summarize the findings in a sentence or two and then show the table or diff.
- **The tool's verdict wins over your own.** If its output differs from what you expected (a number kept as `1.0`, an XML name sanitized, a date token flagged), that difference is usually the point. Mention it rather than "fixing" it.

## When not to use it

DevTools works on data the user has in hand: text they paste or a file they name. When the request is to write or change code that does one of these things (a validation regex in a class, password hashing in a login handler, a serializer setting, a date helper with tests), to edit the project's source (sorting imports), or to run the project's own formatter or linter, do the coding directly. Diffs between git branches, commits or the working tree belong to git. Code review, explaining a format, and prose editing are outside DevTools too.

If a request only partly fits, for example "convert this JSON to C# and add validation attributes", use the tool for the part it covers (the classes), then do the rest yourself and say which part came from which.
