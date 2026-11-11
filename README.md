# DevTools MCP

DevTools MCP gives your AI client 50 exact, offline developer tools: JSON/XML/CSV/YAML formatting and conversion, C# and Java code generation, comparison of 2 to 20 documents, JSONPath/XPath search, Base64, hashes, JWT, UUID, timestamps, C#/Java date formats, unit conversion and anonymization.

It runs as a [Model Context Protocol](https://modelcontextprotocol.io) server over stdio. A Claude skill is included that picks the right tool for each request.

**Website:** <https://mahdiabdnabi.github.io/devtools-mcp/> (the `docs/` folder, published with GitHub Pages).

## What's here

| Path | What it is |
| --- | --- |
| `docs/` | The website (static HTML, no build step), published with GitHub Pages |
| `docs/download/devtools-cli.zip` | The MCP server: a build of the DevTools command line, run as `devtools.mjs mcp`. Its source is not in this repository yet |
| `docs/download/devtools-skill.zip` | The skill, ready to unzip into `~/.claude/skills` |
| `skill/devtools/` | The skill's source: `SKILL.md`, the tool reference and the test cases (`evals/`) |
| `docs/data/tools.json` | The server's `tools/list` output, which the site and the tool reference are generated from |
| `scripts/gen-catalog.mjs` | Regenerates `skill/devtools/references/tools.md` from `docs/data/tools.json` |
| `scripts/release.mjs` | Builds both zips, hashes them and stamps the version, date, size and SHA-256 into the website |
| `CHANGELOG.md` | What changed in each release |

The site and the skill are source. The server is published as a build for now. Its source will be published here once its history has been cleaned up.

## Quick start

1. Install [Node.js](https://nodejs.org/) 22.18 or later (or 24.11+). The server is built and tested on Windows; macOS and Linux are not tested.
2. Unzip `devtools-cli.zip`. It holds one folder, `devtools-cli`; the examples below assume `C:\Tools\devtools-cli`.
3. Connect your client.

   Claude Code:

   ```
   claude mcp add --scope user devtools -- node C:\Tools\devtools-cli\devtools.mjs mcp
   ```

   Claude Desktop: open Settings, then Developer, and choose Edit Config. The file is `%APPDATA%\Claude\claude_desktop_config.json` on Windows (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS). Add the entry, then quit and restart Claude Desktop:

   ```json
   {
     "mcpServers": {
       "devtools": { "command": "node", "args": ["C:\\Tools\\devtools-cli\\devtools.mjs", "mcp"] }
     }
   }
   ```

4. Optional, for Claude Code: unzip `devtools-skill.zip` into `%USERPROFILE%\.claude\skills`, so that you get `.claude\skills\devtools\SKILL.md`.

## Safety

- **Your AI client sees your data.** The server sends nothing anywhere, but whatever passes through the conversation (what you paste, what you ask the AI to process, the results it reads back) is seen by your AI client and its provider. Anonymizing in the conversation helps with what you share next; it does not hide text you have already pasted. To keep a document out of the conversation, name its file instead of pasting it: the server reads the file and only the result is sent, unless the client also opens the file with its own tools.
- **Offline.** The server talks only over stdio. It opens no port, and a network guard denies all network access to the tools.
- **Read-only files.** Files are read only at the exact path named in a call; network shares and device names are refused. No tool can write a file.
- **Your client chooses the paths.** The AI client decides which paths to read, so connect DevTools only to a client you trust with your files.
- **Limits.** Each call runs in a sandboxed worker with a time limit (60 s) and size limits (64 MB in, 50,000 characters out, by default). A larger result is refused with its size, never cut; raise the limit with `--max-output`.
- **Large documents.** Every text input also takes a file path (`textFile` beside `text`, `documentsFiles` beside `documents`), so a large document need not be written into the call.
- **User plugins.** Plugins in your user plugin folder are served too. They are trusted code, so install only plugins you trust.

## Updating the tool reference

After a new server build, regenerate the catalog from its `tools/list` output, saved as `docs/data/tools.json`:

```
node scripts/gen-catalog.mjs
```

## Making a release

1. Build the server in the DevTools repo (`npm run package` writes `dist\package\devtools-cli`, with its licence and third-party notices).
2. Add a `## <version>` section to `CHANGELOG.md`.
3. Run the release script. It stops if the server folder lacks its licence or notices, if the skill has no version, or if a file holds a path inside your home folder. Otherwise it writes both zips to `docs/download/` and stamps the website:

   ```
   node scripts/release.mjs --version 0.1.0 --cli <path to devtools-cli>
   ```

4. Check that the page matches the zips: `node scripts/release.mjs --check`.

## Licence

The site and the skill: MIT. See [LICENSE](LICENSE).
