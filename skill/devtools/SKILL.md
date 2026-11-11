---
name: devtools
description: Exact, offline developer data tools from the DevTools MCP server (tools named like `json-xml__format-json`). Use this skill whenever the user has data in hand, pasted or in a file they name, and wants an exact result about it - format, minify or check JSON/XML/CSV; convert between JSON, XML, CSV and YAML; C# or Java classes or records from a JSON, XML or CSV sample; compare documents; JSONPath/XPath or find a key or value; Base64, URL and HTML encoding; hashes of text or files; decode a JWT; UUIDs; Unix timestamps; C#/Java date patterns; unit conversion; anonymize data; case, diff, regex test, sort or dedupe on given text. Read it before calling any DevTools tool, and before doing such work in your head or with a one-off script or shell command - hand results drift, and the skill says which tool fits and how to pass files and read results. Not for writing or editing code that does these things (a validator regex, password hashing, sorting imports), git diffs, or running the project's formatter.
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

If no such tool is available, the server is not connected to this session. Tell the user so in your answer, with the setup below, even when you then finish the task another way, because otherwise they won't know why the result didn't come from DevTools. Use the folder where they unzipped `devtools-cli`:

- Claude Code: `claude mcp add --scope user devtools -- node C:\Tools\devtools-cli\devtools.mjs mcp`
- Claude Desktop, in `claude_desktop_config.json`: `"mcpServers": { "devtools": { "command": "node", "args": ["C:\\Tools\\devtools-cli\\devtools.mjs", "mcp"] } }`

Then finish the task only in a way the user would expect: by hand when it is small and they want it now, or with the DevTools command line if they have it (see "The DevTools command line"). Either way, say how the result was produced.

## Choose the tool

Decide in two steps: what the input is, and what the user wants out of it. The table covers the common goals; `references/tools.md` lists every tool with its arguments, defaults, limits and outputs, so read the entry for the tool you picked when you need an option that is not obvious. `references/caveats.md` holds the per-tool surprises worth knowing before you report a result.

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
| Base64 of a file's bytes (binary safe) | `encoding__base64-file` |
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

- **`compare__*` or `text__diff`.** For structured documents, use `compare__json`/`xml`/`csv`: it understands keys and arrays (`key` matches array items or CSV rows by id, `ignoreOrder` treats arrays as sets, `ignorePaths` skips volatile fields, `mode: structure` compares only shape and types). Numbers compare by their text unless you set `numbers: "value"`, so `10.50` against `10.5` shows as `changed (same value)`; set it when the user cares about amounts rather than spelling. Use `text__diff` for prose, code, logs, or when the user wants a line or word diff.
- **`search__find-property`, `search__find-value`, `search__jsonpath` or `search__xpath`.** Use find-property when the user knows a key name but not where it is, and find-value when they know a value but not which field holds it. Use JSONPath or XPath when they describe a location or a filter ("all books under 10 dollars"); write the expression for them.
- **`encoding__base64` or `encoding__base64-file`, and `encoding__hash` or `encoding__hash-file`.** The text tools work on characters: pasted text, or a text file given as `textFile`, hashed as UTF-8. The `-file` tools work on the file's bytes exactly as stored, line endings and byte order mark included. Use the `-file` tools for binary files and whenever the user wants the digest of the file itself, for example to check it against a published checksum.
- **`encoding__timestamp` or `datetime__*`.** Epoch numbers and ISO conversions go to `encoding__timestamp`. Questions about format strings (`yyyy-MM-dd'T'HH:mm`, `"o"`, `"R"`) go to the `datetime__` tools.
- **`units__convert` or `units__convert-all`.** Use convert-all when the user wants a quantity "in all units" or doesn't say the target unit.

### Chaining

When no single tool does the job, chain them and pass each output's text, without its label, to the next call:

- CSV or YAML to C# or Java classes: `tabular__csv-to-json` (with `inferTypes: true` if the classes should get numbers and booleans) or `text__yaml-to-json`, then `codegen__json-to-*`.
- Anonymize, then pretty-print: `anonymize__json` with `indent`, or `json-xml__format-json` afterwards.
- Pull a subset, then convert it: `search__jsonpath`, then `tabular__json-to-csv`.

## Call it well

- **Pass the user's data unchanged.** Most tools take the document in `text` (`documents` for compare, `original` and `modified` for diff). Don't reformat or tidy it first: escaping, whitespace and number spelling matter, and the tool handles them.
- **Name files instead of copying them.** Every text input also takes a file path: `text` has `textFile`, `rules` has `rulesFile`, `original` has `originalFile`, and a list input such as `documents` has `documentsFiles`. When the user's data is in a file, pass its absolute path this way rather than reading the file and typing its content into the call. The server reads the file itself, so nothing can drift in a copy, and the document doesn't have to pass through the conversation at all. A relative path is resolved against the folder the client started the server in, which is rarely the user's project, so use absolute paths. Give each input either inline or as a file, not both. The `-file` tools take their path in `file`. Files are read only; the server never writes one (see "Size and saving").
- **Options.** Leave options at their defaults unless the user asked for something. Do set the ones that their request implies:
  - `indent: "4"`;
  - `rootName` / `namespace` / `package` for code generation;
  - `style: "record"` when they ask for records;
  - `key`, `ignorePaths` and `numbers` for compare;
  - `timezone` for timestamps and JWT dates;
  - `direction` for date-pattern conversion.

  Enum values are exact strings, so check `references/tools.md` when unsure.
- **Anonymization needs rules.** The anonymize tools do not detect sensitive data by themselves. They apply a rule set, a JSON string, that you write from what the user wants hidden. Read `references/anonymize-rules.md` for the format and examples. Validate a new rule set with `anonymize__rules` first. Pseudonyms and hashes are keyed by `seed`: when the user wants them stable (the same person gets the same pseudonym next month), they need their own secret seed and must keep it. Ask for it. Don't make one up and present it as theirs; if you go ahead without one, say so, because the tool will warn that an empty seed makes the values guessable.

## Privacy: what the AI sees

The DevTools server sends nothing anywhere, but this conversation is not local. Whatever you pass inline, and whatever a tool returns, is seen by you and sent to the AI provider like the rest of the conversation. With a file argument, the server reads the file and only the result comes back.

Usually that is fine and needs no comment. It matters when the user's aim is to keep the data away from the AI, which is often the point of an anonymization request ("before it leaves the company", "it's real customer data"). Then don't read the file or ask them to paste it, and say in one sentence how you are keeping it out of the conversation:

- best, when you can run commands: the DevTools command line with `--file` and `--out` (below), so neither the original nor the result enters the conversation;
- otherwise pass the path as `textFile`, so only the anonymized result comes back (plus anything the rules missed);
- or, if neither fits, point them to the DevTools desktop app or the command line to run it themselves.

Write the rules from the field names the user gives you; if you need the column names, ask, or with their agreement look at the header line only.

## Size and saving

- **Input.** Text you type into a call travels through the conversation and is re-typed token by token, so inline is for text the user pasted or a small file. For anything on disk, use the file argument; the server reads files of many megabytes (64 MB per call by default).
- **Output.** The server refuses a result over 50,000 characters by default with `E_MCP_RESULT_TOO_LARGE`, which states the size. It never cuts a result, because a cut document is not exact, and AI clients have their own limit as well (Claude Code's default is 25,000 tokens). When you hit it, choose by what the user wants:
  - an answer about the data (a value, a count, the matching records, what changed): narrow the call, for example query with `search__jsonpath`, `search__xpath` or `search__find-property`, or set `maxDiffs` for compare;
  - the whole transformed document in a file: use the command line;
  - neither possible: tell the user the size and the options. Don't split a document and stitch the pieces unless the format allows it and the user agrees, and don't present part of a result as the whole.
- **Saving.** The server never writes files. When the result is in the conversation and the user wants it saved, write the output exactly as it arrived, without retyping or reformatting it, and leave out the label and the diagnostics. For a large result, or a file-to-file job, use the command line, which writes the file itself.

### The DevTools command line

The server is the DevTools command line run as `devtools.mjs mcp`, so a user who has the server has the command line too. When you can run shell commands, find its path in the server's registration (`claude mcp get devtools` in Claude Code, or the `mcpServers` entry) and run the tool directly:

```
node "<folder>\devtools.mjs" json-xml.format-json --file "<input>" --indent 2 --out "<output>"
```

Command-line tool ids use a dot (`json-xml.format-json`) where tool names here use `__`. Options are `--<name> <value>`; more inputs are `--file.<id>` or `--text.<id>` (for example `--file.rules rules.json --seed <secret>`). `node "<folder>\devtools.mjs" help <tool id>` lists a tool's inputs, options and outputs. `--out` writes the main output (`--force` replaces an existing file). Exit code 1 means the tool reported an error, which is printed with its line and column. Tell the user you used the command line and show the command, so they can run it again.

## Read the result

This is what arrives in Claude Code, and the server sends the same items to every client:

- **One output:** a single text item with no label: the document, the code, or a table as CSV.
- **Several outputs:** each comes after its own label item, such as `[output 2 of 2: changes, table as CSV]`, which names the output and says whether it is text, a table as CSV or a unified diff. The label is not part of the output, so don't copy it into a file or into the next call.
- **Diagnostics:** if there are any, they come last, as one item that starts with `[diagnostics: n]`, one line each: `severity CODE: message (line l, column c)`.
- **Errors:** the call is marked as failed, and the result is usually only the diagnostics.
- **Diffs** that would repeat what the other outputs show are sent only with `includeDiff: true`. For compare, the changes table is the answer; ask for the diff only when the user wants one.

Another client may show the items joined together or drop some of them. Work from what you actually received: if a result looks incomplete (a label with nothing after it, or no output at all), say so, and never describe an output or a warning you did not see.

- **Errors.** Show the user the message with its line and column. If the cause is clear and in your arguments, fix them and call again. If it is in the user's data (a trailing comma, a missing quote), tell them where it is; if you then fix their data to finish the task, say exactly what you changed. Don't present partial output as a success.
- **Warnings and info.** Keep the ones that matter to the user, for example "rule 2 was never applied", "a change differs only in how a number is written", a lossy C#/Java pattern token, or rounding to 15 significant digits. Drop routine counts unless asked.
- **Data outputs.** Give the output as the tool produced it, in a code block with the right language, rather than re-typing it. A table arrives as CSV: show a short one as a Markdown table or as the CSV, with the values unchanged, and summarize a long one. For compare and search results, state the findings in a sentence or two, then show the table.
- **The tool's verdict wins over your own.** If its output differs from what you expected (a number kept as `1.0`, an XML name sanitized, a date token flagged), that difference is usually the point. Mention it rather than "fixing" it.

## When not to use it

DevTools works on data the user has in hand: text they paste or a file they name. When the request is to write or change code that does one of these things (a validation regex in a class, password hashing in a login handler, a serializer setting, a date helper with tests), to edit the project's source (sorting imports), or to run the project's own formatter or linter, do the coding directly. Diffs between git branches, commits or the working tree belong to git. Code review, explaining a format, and prose editing are outside DevTools too.

If a request only partly fits, for example "convert this JSON to C# and add validation attributes", use the tool for the part it covers (the classes), then do the rest yourself and say which part came from which.
