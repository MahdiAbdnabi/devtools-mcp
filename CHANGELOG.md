# Changelog

Changes to what this repository publishes: the website, the skill and the two downloads. The release script (`scripts/release.mjs`) refuses to stamp a version that has no heading here.

## Unreleased

### Website

- Each code block in Get started has its own Copy button, and a field for the folder you unzipped the server to rewrites every command.
- The Claude Desktop tab says where `claude_desktop_config.json` is. Step 1 says the server is built and tested on Windows. A first prompt to try follows the three steps.
- The page says plainly that the server sends nothing anywhere, but that whatever passes through your AI conversation is seen by your AI client and its provider.
- The page says what in this repository is source (the site and the skill) and what is a build (the server).
- Tool catalog: argument descriptions are shown, opening a card no longer stretches its row, a status line gives the count for the current filter, and each tool has its own link.
- Phones: the section links stay reachable and the catalog is compact.
- Version, date, size and SHA-256 beside each download, written by the release script, and how to check a hash on Windows.
- Share tags and image, a canonical link and a descriptive title. A skip link, Home and End on the client tabs, and screenshots that follow the light or dark theme.

## 2026-11-10

First publication, without a version number: the website, the `devtools` skill and a build of the DevTools command line that serves the tools over MCP.
