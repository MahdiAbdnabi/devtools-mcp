# DevTools MCP

DevTools MCP gives your AI client 50 exact, offline developer tools: JSON/XML/CSV/YAML formatting and conversion, C# and Java code generation, comparison of 2 to 20 documents, JSONPath/XPath search, Base64, hashes, JWT, UUID, timestamps, C#/Java date formats, unit conversion and anonymization.

It runs as a [Model Context Protocol](https://modelcontextprotocol.io) server over stdio. A Claude skill is included that picks the right tool for each request.

**Website:** see the `docs/` folder, published with GitHub Pages.

## What's here

| Path | What it is |
| --- | --- |
| `docs/` | The website (static HTML, no build step), published with GitHub Pages |
| `docs/download/devtools-cli.zip` | The MCP server: the DevTools command line, run as `devtools.mjs mcp` |
| `docs/download/devtools-skill.zip` | The skill, ready to unzip into `~/.claude/skills` |
| `skill/devtools/` | The skill's source: `SKILL.md`, the tool reference and the test cases (`evals/`) |
| `docs/data/tools.json` | The server's `tools/list` output, which the site and the tool reference are generated from |
| `scripts/gen-catalog.mjs` | Regenerates `skill/devtools/references/tools.md` from `docs/data/tools.json` |

## Quick start

1. Install [Node.js](https://nodejs.org/) 22.18 or later (or 24.11+).
2. Unzip `devtools-cli.zip`, for example to `C:\Tools\devtools-cli`.
3. Connect your client.

   Claude Code:

   ```
   claude mcp add --scope user devtools -- node C:\Tools\devtools-cli\devtools.mjs mcp
   ```

   Claude Desktop, in `claude_desktop_config.json`:

   ```json
   {
     "mcpServers": {
       "devtools": { "command": "node", "args": ["C:\\Tools\\devtools-cli\\devtools.mjs", "mcp"] }
     }
   }
   ```

4. Optional: unzip `devtools-skill.zip` into `%USERPROFILE%\.claude\skills`.

## Safety

- **Offline.** The server talks only over stdio. It opens no port, and a network guard denies all network access to the tools.
- **Read-only files.** Files are read only at the exact path named in a call; network shares and device names are refused. No tool can write a file.
- **Your client chooses the paths.** The AI client decides which paths to read, so connect DevTools only to a client you trust with your files.
- **Limits.** Each call runs in a sandboxed worker with a time limit (60 s) and size limits (64 MB in, 32M characters out, by default).
- **User plugins.** Plugins in your user plugin folder are served too. They are trusted code, so install only plugins you trust.

## Updating the tool reference

After a new server build, regenerate the catalog from its `tools/list` output, saved as `docs/data/tools.json`:

```
node scripts/gen-catalog.mjs
```

## Licence

MIT. See [LICENSE](LICENSE).
