# Caveats the tool descriptions don't state

Hand-maintained. `tools.md` is generated from the server and already says what each tool returns and its documented limits; this file holds the surprises that come only from running the tools. Each was checked against DevTools 0.1.0. Mention one to the user when it affects their result.

## Code generation (`codegen__*`)

- **Decimal numbers become `double`.** A JSON number such as `49.90` gives `double` in C# and Java; whole numbers give `int`, or `long` when they don't fit. For money or other exact amounts, tell the user and suggest `decimal` (C#) or `BigDecimal` (Java) if they want it; leave the generated code as the tool wrote it unless they ask.
- **A sample shows only what it contains.** An element that appears once in an XML sample becomes a single property, and twice becomes a list. A JSON key that is only ever `null`, or an array that is always empty, gets an open type (`JsonElement` in C#), with an info diagnostic. When the user's sample has one of a repeated item, say that the type follows the sample, or ask for a sample with two.
- **CSV first.** Code from CSV goes through `tabular__csv-to-json`, which reads every cell as a string unless `inferTypes` is on.

## Hashes and Base64 of files

- **A text input from a file is decoded first.** `encoding__hash` and `encoding__base64` with `textFile` read the file as text: a UTF-8 byte order mark is dropped and UTF-16 is converted, so the digest can differ from the file's own. Line endings are kept as they are. For the digest or Base64 of the file itself, use `encoding__hash-file` or `encoding__base64-file`, which read the bytes.
- **Pasted text has the line endings of the conversation.** A digest of pasted text matches a file's digest only if the bytes are the same, including the final line break. When the user compares against a published checksum, use the file.

## Regular expressions (`text__regex`)

- **JavaScript syntax.** Inline flag groups such as `(?i)` are an error; use the `flags` option instead (the tool says so in a hint). Possessive quantifiers and atomic groups from .NET, Java or PCRE are not available. When the user's pattern is meant for another engine, say that the test ran with JavaScript semantics, and point out any construct that behaves differently there.

## Timestamps (`encoding__timestamp`)

- **Seconds or milliseconds.** With `unit: auto`, values below 1e11 are read as seconds and larger values as milliseconds. The result's "Interpreted as" column says which; mention it when the value could be either, or set `unit`.

## XML to JSON

- **Shape follows the count.** An element that occurs once becomes a value, and more than once becomes an array, so two documents of the same kind can give different JSON shapes. Mention this when the user will process the JSON in code.
