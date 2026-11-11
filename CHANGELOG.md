# Changelog

Changes to what this repository publishes: the website, the skill and the two downloads. A heading names the server version; the skill has its own version, given in its section. The release script (`scripts/release.mjs`) refuses to stamp a server version that has no heading here.

## 0.1.0

### Server: devtools-cli 0.1.0

- The first build with a version number. The folder now holds its licence (MIT), the notices of the third-party code bundled into it, and a short README.
- Results are text only and the same for every client: one item per output, each preceded by a label such as `[output 2 of 2: changes, table as CSV]` when there is more than one, and the diagnostics last, as `severity CODE: message (line l, column c)`.
- Every text input also takes a file path (`textFile` beside `text`, `documentsFiles` beside `documents`), read-only, so a document need not be pasted into the conversation.
- A result is limited to 50,000 characters by default. A larger one is refused with its size and the limit, never cut; `--max-output` raises the limit.
- `--tools` serves only the plugins or tools you list.
- The compare tools have `numbers: text | value`. In text mode, a number written differently with the same value (`9.90` and `9.9`) is reported as "changed (same value)".
- Every tool says what it returns, every input has a description, and every tool is marked read-only and closed-world. The server reports its version and gives short instructions to clients without the skill.
- Options that would write a file are no longer offered over MCP.

### Skill: devtools 1.1.0

- A sharper description of when to use DevTools and when not to.
- The setup command and the tool-naming notes match the site.
- Ten evaluation cases (seven new), among them invalid input, a request outside DevTools, a server that is not connected, a seed the user did not give, a lossy date pattern and a large input.

### Website

- Each code block in Get started has its own Copy button, and a field for the folder you unzipped the server to rewrites every command.
- The Claude Desktop tab says where `claude_desktop_config.json` is. Step 1 says the server is built and tested on Windows. A first prompt to try follows the three steps.
- The page says plainly that the server sends nothing anywhere, but that whatever passes through your AI conversation is seen by your AI client and its provider, and that a file path keeps a document out of the conversation.
- The page says what in this repository is source (the site and the skill) and what is a build (the server), and that the server's source will follow.
- The hero shows a real request, the tool call and its exact result, and three short examples show why exact matters.
- The answer on large documents describes file-path inputs and the result limit.
- Tool catalog: argument descriptions and what each tool returns are shown, opening a card no longer stretches its row, a status line gives the count for the current filter, and each tool has its own link.
- Phones: the section links stay reachable and the catalog is compact.
- Version, date, size and SHA-256 beside each download, written by the release script, and how to check a hash on Windows.
- Share tags and image, a canonical link and a descriptive title. A skip link, Home and End on the client tabs, and screenshots that follow the light or dark theme.

## 2026-11-10

First publication, without a version number: the website, the `devtools` skill and a build of the DevTools command line that serves the tools over MCP.
