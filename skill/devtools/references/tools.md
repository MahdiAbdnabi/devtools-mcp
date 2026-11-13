# DevTools MCP tool reference

Generated from the server's `tools/list` (50 tools). Names are shown without the client prefix: Claude Code shows `json-xml__format-json` as `mcp__devtools__json-xml__format-json`.

## Contents

- [anonymize](#anonymize)
- [codegen](#codegen)
- [compare](#compare)
- [datetime](#datetime)
- [encoding](#encoding)
- [json-xml](#json-xml)
- [search](#search)
- [tabular](#tabular)
- [text](#text)
- [units](#units)

## anonymize

### `anonymize__csv`

Anonymize CSV: Replace cells and headers in CSV, selected by column name or number, driven by a rule set. Returns the anonymized document. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The CSV document to anonymize. Required: give the text here or a file path in textFile. |
| `rules` | string |  | Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). Required: give the text here or a file path in rulesFile. |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |
| `delimiter` | `auto` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator of the input; the output keeps it. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `header` | boolean | `true` | Column names can be used in rules only when this is on. |
| `escapeFormulas` | boolean | `true` | Prefix ' to values written by a rule that start with =, +, -, @, tab or CR so a spreadsheet does not run them. Cells the rules did not change are never altered. |
| `lineEnding` | `crlf` \| `lf` | `"crlf"` | Record separator (RFC 4180 uses CRLF). |
| `trailingNewline` | boolean | `false` | End the last record with a line break. |
| `bom` | boolean | `false` | Write a UTF-8 byte order mark first. |
| `quoteAll` | boolean | `false` | Put every field in quotes. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |
| `rulesFile` | string |  | Path of a file to read (read-only) instead of "rules": UTF-8, or UTF-16 with a byte order mark. |

### `anonymize__json`

Anonymize JSON: Replace values and keys in JSON with masks, fixed text, consistent pseudonyms, keyed hashes or nothing, driven by a rule set. Returns the anonymized document. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON document to anonymize. Required: give the text here or a file path in textFile. |
| `rules` | string |  | Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). Required: give the text here or a file path in rulesFile. |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation of the printed result. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |
| `rulesFile` | string |  | Path of a file to read (read-only) instead of "rules": UTF-8, or UTF-16 with a byte order mark. |

### `anonymize__rules`

Check and format a rule set: Validate a rule set and print it in canonical form: defaults filled in, shorthand expanded. Returns the canonical rule set as JSON; errors name the field and the position. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `rules` | string |  | Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). Required: give the text here or a file path in rulesFile. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation of the printed result. |
| `rulesFile` | string |  | Path of a file to read (read-only) instead of "rules": UTF-8, or UTF-16 with a byte order mark. |

### `anonymize__text`

Anonymize text: Replace literals and regular-expression matches in plain text, driven by a rule set; line endings and everything outside matches stay as they are. Returns the anonymized document. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text to anonymize. Required: give the text here or a file path in textFile. |
| `rules` | string |  | Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). Required: give the text here or a file path in rulesFile. |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |
| `rulesFile` | string |  | Path of a file to read (read-only) instead of "rules": UTF-8, or UTF-16 with a byte order mark. |

### `anonymize__xml`

Anonymize XML: Replace attribute values, text and names in XML, driven by a rule set. Paths start below the root element. Returns the anonymized document. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The XML document to anonymize. Required: give the text here or a file path in textFile. |
| `rules` | string |  | Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). Required: give the text here or a file path in rulesFile. |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation of the printed result. |
| `removeComments` | boolean | `true` | Remove XML comments (they often hold the data you are hiding). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |
| `rulesFile` | string |  | Path of a file to read (read-only) instead of "rules": UTF-8, or UTF-16 with a byte order mark. |

## codegen

### `codegen__json-to-csharp`

JSON to C# classes: Generate C# classes or records from a JSON sample; a root array merges its elements as samples. Returns the source code as one text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | A sample JSON document; the types are inferred from its values. Required: give the text here or a file path in textFile. |
| `annotations` | `system-text-json` \| `newtonsoft` \| `none` | `"system-text-json"` | Serializer attributes to write (default system-text-json): System.Text.Json attributes (default), Newtonsoft.Json attributes, No annotations. |
| `style` | `class` \| `record` | `"class"` | Classes with properties (default) or positional records. |
| `namespace` | string | `"Generated"` | C# namespace of the generated code (default Generated); empty writes none. |
| `rootName` | string | `"Root"` | Name of the root class (default Root). |
| `nullableReferenceTypes` | boolean | `true` | Write #nullable enable and string? for optional members (default on). |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `codegen__json-to-java`

JSON to Java classes: Generate Java POJOs or records from a JSON sample; every class is nested in the root class. Returns the source code as one text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | A sample JSON document; the types are inferred from its values. Required: give the text here or a file path in textFile. |
| `annotations` | `jackson` \| `none` | `"jackson"` | Serializer attributes to write (default jackson): Jackson annotations (default), No annotations. |
| `style` | `class` \| `record` | `"class"` | POJO classes (default) or records (Java 16 or newer). |
| `lombok` | boolean | `false` | Write @Data instead of getters and setters (default off); ignored for records. |
| `package` | string | `"generated"` | Java package of the generated code (default generated); empty writes none. |
| `rootName` | string | `"Root"` | Name of the root class (default Root). |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `codegen__xml-to-csharp`

XML to C# classes: Generate C# classes or records from an XML sample: attributes and text become properties, repeated elements become lists. Returns the source code as one text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | A sample XML document; the types are inferred from its values. Required: give the text here or a file path in textFile. |
| `annotations` | `xml-serializer` \| `none` | `"xml-serializer"` | Serializer attributes to write (default xml-serializer): XmlSerializer attributes (default), No annotations. |
| `style` | `class` \| `record` | `"class"` | Classes with properties (default) or positional records. |
| `namespace` | string | `"Generated"` | C# namespace of the generated code (default Generated); empty writes none. |
| `rootName` | string | `""` | Name of the root class (default empty: the root element name). |
| `inferTypes` | boolean | `true` | Type text values as numbers and booleans (default on); off makes them strings. |
| `nullableReferenceTypes` | boolean | `true` | Write #nullable enable and string? for optional members (default on). |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `codegen__xml-to-java`

XML to Java classes: Generate Java POJOs or records from an XML sample: attributes and text become fields, repeated elements become lists. Returns the source code as one text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | A sample XML document; the types are inferred from its values. Required: give the text here or a file path in textFile. |
| `annotations` | `jackson-xml` \| `none` | `"jackson-xml"` | Serializer attributes to write (default jackson-xml): Jackson XML annotations (default), No annotations. |
| `style` | `class` \| `record` | `"class"` | POJO classes (default) or records (Java 16 or newer). |
| `lombok` | boolean | `false` | Write @Data instead of getters and setters (default off); ignored for records. |
| `package` | string | `"generated"` | Java package of the generated code (default generated); empty writes none. |
| `rootName` | string | `""` | Name of the root class (default empty: the root element name). |
| `inferTypes` | boolean | `true` | Type text values as numbers and booleans (default on); off makes them strings. |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

## compare

### `compare__csv`

Compare CSV: Compare 2 to 20 CSV documents with a base. The first record is the header; rows can be matched by key columns. Returns a summary table (one row per compared document) and a table of the differences (document, change, path, base value, value); cells compare as text unless inferTypes is on. Outputs: summary (table as CSV), changes (table as CSV); sidebyside (unified diff) only with includeDiff.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `documents` | array of strings |  | Two to twenty documents; every one is compared with the base. Required: give the texts here or file paths in documentsFiles. |
| `names` | array of strings |  | Optional labels, one per document. Give the texts here or file paths in namesFiles. |
| `mode` | `values` \| `structure` | `"values"` | Compare the values, or only the keys and the value types. |
| `base` | integer | `1` | min 1, max 20; Which document is the reference; every other document is compared with it. |
| `key` | string | `""` | Match array items (and CSV rows) by these fields instead of by position: id or id, sku. Items must carry every field as a plain value. |
| `ignoreOrder` | boolean | `false` | Treat arrays without a key as sets: the same items in another order are equal. |
| `ignorePaths` | string | `""` | Dot paths to leave out, one per line (or separated by ;): items.price, catalog.book.@id. Array positions are skipped. |
| `numbers` | `text` \| `value` | `"text"` | text: 10.50 and 10.5 differ (marked as the same value); value: numbers that are equal as decimals are equal, and in XML and CSV number-like text counts as a number. |
| `maxDiffs` | integer | `1000` | min 1, max 100000; Most differences listed per document; all are still counted. |
| `delimiter` | `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` \| `auto` | `"comma"` | Field separator; auto detects it for each document. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `inferTypes` | boolean | `false` | Read true, false and number text as booleans and numbers instead of strings. |
| `documentsFiles` | array of strings |  | Paths of files to read (read-only) instead of "documents", one document per file. |
| `namesFiles` | array of strings |  | Paths of files to read (read-only) instead of "names", one document per file. |
| `includeDiff` | boolean | `false` | Also return a unified diff of the two documents as printed. |

### `compare__json`

Compare JSON: Compare 2 to 20 JSON documents with a base by values or by structure, with arrays matched by key or in any order. Returns a summary table (one row per compared document) and a table of the differences (document, change, path, base value, value). Outputs: summary (table as CSV), changes (table as CSV); sidebyside (unified diff) only with includeDiff.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `documents` | array of strings |  | Two to twenty documents; every one is compared with the base. Required: give the texts here or file paths in documentsFiles. |
| `names` | array of strings |  | Optional labels, one per document. Give the texts here or file paths in namesFiles. |
| `mode` | `values` \| `structure` | `"values"` | Compare the values, or only the keys and the value types. |
| `base` | integer | `1` | min 1, max 20; Which document is the reference; every other document is compared with it. |
| `key` | string | `""` | Match array items (and CSV rows) by these fields instead of by position: id or id, sku. Items must carry every field as a plain value. |
| `ignoreOrder` | boolean | `false` | Treat arrays without a key as sets: the same items in another order are equal. |
| `ignorePaths` | string | `""` | Dot paths to leave out, one per line (or separated by ;): items.price, catalog.book.@id. Array positions are skipped. |
| `numbers` | `text` \| `value` | `"text"` | text: 10.50 and 10.5 differ (marked as the same value); value: numbers that are equal as decimals are equal, and in XML and CSV number-like text counts as a number. |
| `maxDiffs` | integer | `1000` | min 1, max 100000; Most differences listed per document; all are still counted. |
| `documentsFiles` | array of strings |  | Paths of files to read (read-only) instead of "documents", one document per file. |
| `namesFiles` | array of strings |  | Paths of files to read (read-only) instead of "names", one document per file. |
| `includeDiff` | boolean | `false` | Also return a unified diff of the two documents as printed. |

### `compare__xml`

Compare XML: Compare 2 to 20 XML documents with a base by values or by structure. Repeated elements can be matched by @attribute or by a child element holding only text. Returns a summary table (one row per compared document) and a table of the differences (document, change, path, base value, value). Outputs: summary (table as CSV), changes (table as CSV); sidebyside (unified diff) only with includeDiff.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `documents` | array of strings |  | Two to twenty documents; every one is compared with the base. Required: give the texts here or file paths in documentsFiles. |
| `names` | array of strings |  | Optional labels, one per document. Give the texts here or file paths in namesFiles. |
| `mode` | `values` \| `structure` | `"values"` | Compare the values, or only the keys and the value types. |
| `base` | integer | `1` | min 1, max 20; Which document is the reference; every other document is compared with it. |
| `key` | string | `""` | Match array items (and CSV rows) by these fields instead of by position: id or id, sku. Items must carry every field as a plain value. |
| `ignoreOrder` | boolean | `false` | Treat arrays without a key as sets: the same items in another order are equal. |
| `ignorePaths` | string | `""` | Dot paths to leave out, one per line (or separated by ;): items.price, catalog.book.@id. Array positions are skipped. |
| `numbers` | `text` \| `value` | `"text"` | text: 10.50 and 10.5 differ (marked as the same value); value: numbers that are equal as decimals are equal, and in XML and CSV number-like text counts as a number. |
| `maxDiffs` | integer | `1000` | min 1, max 100000; Most differences listed per document; all are still counted. |
| `inferTypes` | boolean | `false` | Read true, false and number text as booleans and numbers instead of strings. |
| `documentsFiles` | array of strings |  | Paths of files to read (read-only) instead of "documents", one document per file. |
| `namesFiles` | array of strings |  | Paths of files to read (read-only) instead of "names", one document per file. |
| `includeDiff` | boolean | `false` | Also return a unified diff of the two documents as printed. |

## datetime

### `datetime__convert`

Convert date patterns: Convert patterns between C# and Java; every token that does not render identically is flagged with the reason. Returns a table with one row per pattern: the converted pattern, whether it round-trips, and the flags. Outputs: table (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `patterns` | string |  | Patterns in the source language, one per line. Blank lines are skipped; at most 200 patterns of 1000 characters. Required: give the text here or a file path in patternsFile. |
| `instant` | string |  | Optional: render both patterns at this instant to see the difference. ISO 8601 with an offset. Give the text here or a file path in instantFile. |
| `direction` | `csharp-to-java` \| `java-to-csharp` | `"csharp-to-java"` | Which language the patterns are written in. |
| `patternsFile` | string |  | Path of a file to read (read-only) instead of "patterns": UTF-8, or UTF-16 with a byte order mark. |
| `instantFile` | string |  | Path of a file to read (read-only) instead of "instant": UTF-8, or UTF-16 with a byte order mark. |

### `datetime__csharp`

C# date format: Render an instant with C# standard and custom format strings under InvariantCulture, as .NET does. Returns a table with one row per format string and its rendering. Outputs: table (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `instant` | string |  | ISO 8601 with an offset, for example 2024-03-05T14:07:09.1203456+05:30 or ...Z. Named time zones are not supported. Required: give the text here or a file path in instantFile. |
| `patterns` | string |  | C# format strings (an empty text renders the default ToString() format), one per line. Blank lines are skipped; at most 200 patterns of 1000 characters. Required: give the text here or a file path in patternsFile. |
| `valueKind` | `offset` \| `utc` | `"offset"` | offset is a DateTimeOffset (the format U throws); utc is a UTC DateTime (K prints Z, U works). |
| `instantFile` | string |  | Path of a file to read (read-only) instead of "instant": UTF-8, or UTF-16 with a byte order mark. |
| `patternsFile` | string |  | Path of a file to read (read-only) instead of "patterns": UTF-8, or UTF-16 with a byte order mark. |

### `datetime__java`

Java date format: Render an instant with Java DateTimeFormatter patterns for Locale.US, with JDK 8 behaviour. Returns a table with one row per pattern and its rendering. Outputs: table (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `instant` | string |  | ISO 8601 with an offset, for example 2024-03-05T14:07:09.1203456+05:30 or ...Z. Named time zones are not supported. Required: give the text here or a file path in instantFile. |
| `patterns` | string |  | Java DateTimeFormatter patterns, one per line. Blank lines are skipped; at most 200 patterns of 1000 characters. Required: give the text here or a file path in patternsFile. |
| `zone` | `offset` \| `UTC` | `"offset"` | offset keeps the offset of the instant (a ZoneOffset); UTC converts it to the UTC region. |
| `instantFile` | string |  | Path of a file to read (read-only) instead of "instant": UTF-8, or UTF-16 with a byte order mark. |
| `patternsFile` | string |  | Path of a file to read (read-only) instead of "patterns": UTF-8, or UTF-16 with a byte order mark. |

### `datetime__reference`

Date format reference: Search every C# and Java date-time specifier; the example column is rendered by the real formatter at a fixed instant. Returns a table with one row per specifier. Outputs: table (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `filter` | string |  | Text to find in any column, ignoring case. It is matched literally, not as a pattern. Give the text here or a file path in filterFile. |
| `platform` | `all` \| `csharp` \| `java` | `"all"` | Only the specifiers of one language. |
| `kind` | `all` \| `standard` \| `custom` \| `letter` \| `syntax` | `"all"` | standard and custom are C#; letter is Java; syntax covers quotes, escapes, optional sections and padding. |
| `filterFile` | string |  | Path of a file to read (read-only) instead of "filter": UTF-8, or UTF-16 with a byte order mark. |

## encoding

### `encoding__base64`

Base64 (text and objects): Encode text, JSON or XML to Base64, or decode Base64 back (strict, standard or URL-safe alphabet). Returns the encoded text, or the decoded text (formatted when source is json or xml); bytes that are not UTF-8 text are an error or a hex view. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text to encode, or the Base64 text to decode. Required: give the text here or a file path in textFile. |
| `mode` | `encode` \| `decode` | `"encode"` | encode turns the input into the encoded form; decode turns it back. |
| `source` | `text` \| `json` \| `xml` | `"text"` | json and xml are parsed first: encode writes them minified, decode formats them. |
| `variant` | `standard` \| `url` | `"standard"` | standard uses + and /, url uses - and _ (RFC 4648 section 5). |
| `padding` | boolean | `true` | Write the = padding on encode. |
| `lineLength` | `0` \| `64` \| `76` | `"0"` | Wrap the encoded text at this width (0 = one line, 76 = MIME). |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Decode with source json or xml: indent of the formatted result, 2 or 4 spaces, a tab, or none for one line. |
| `binary` | `error` \| `hex` | `"error"` | What decode does when the bytes are not UTF-8 text: report an error or show a hex view. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `encoding__base64-file`

Base64 (file): Encode a file to Base64 text, or decode a file that holds Base64 (binary safe). Returns the Base64 text, or the decoded text; decoded bytes that are not UTF-8 text are a hex view or an error. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `file` | string |  | **required**; The file to encode, or the file holding the Base64 text to decode. Path of a file to read (read-only). |
| `mode` | `encode` \| `decode` | `"encode"` | encode turns the input into the encoded form; decode turns it back. |
| `variant` | `standard` \| `url` | `"standard"` | standard uses + and /, url uses - and _ (RFC 4648 section 5). |
| `padding` | boolean | `true` | Write the = padding on encode. |
| `lineLength` | `0` \| `64` \| `76` | `"0"` | Wrap the encoded text at this width (0 = one line, 76 = MIME). |
| `binary` | `error` \| `hex` | `"hex"` | What decode does when the bytes are not UTF-8 text: show a hex view or report an error. |

### `encoding__hash`

Hash (text): MD5, SHA-1, SHA-256 and SHA-512 of text (UTF-8). Returns a table with one row per algorithm: its digest and bit length. Outputs: digests (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text to hash, taken as UTF-8 bytes. Required: give the text here or a file path in textFile. |
| `algorithm` | `all` \| `md5` \| `sha1` \| `sha256` \| `sha512` | `"all"` | The digest to compute, or all four (one row each). |
| `format` | `hex` \| `base64` | `"hex"` | How each digest is written: hexadecimal or Base64. |
| `uppercase` | boolean | `false` | Write hexadecimal digests in upper case (format hex only). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `encoding__hash-file`

Hash (file): MD5, SHA-1, SHA-256 and SHA-512 of a file, streamed. Returns a table with one row per algorithm and a line with the file size. Outputs: digests (table as CSV), info (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `file` | string |  | **required**; The file to hash. Path of a file to read (read-only). |
| `algorithm` | `all` \| `md5` \| `sha1` \| `sha256` \| `sha512` | `"all"` | The digest to compute, or all four (one row each). |
| `format` | `hex` \| `base64` | `"hex"` | How each digest is written: hexadecimal or Base64. |
| `uppercase` | boolean | `false` | Write hexadecimal digests in upper case (format hex only). |

### `encoding__html`

HTML entities: Encode text to HTML entities or decode named (HTML 4.01) and numeric references. Returns the encoded or decoded text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text to encode, or the text with entities to decode. Required: give the text here or a file path in textFile. |
| `mode` | `encode` \| `decode` | `"encode"` | encode turns the input into the encoded form; decode turns it back. |
| `scope` | `minimal` \| `non-ascii` | `"minimal"` | minimal escapes only & < > " and '; non-ascii also escapes every character outside ASCII. |
| `numeric` | `hex` \| `decimal` | `"hex"` | Notation for characters without a name (non-ascii scope). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `encoding__jwt`

JWT decoder (no verification): Decode the header and payload of a JWT and show its dates. The signature is never verified. Returns the header and the payload as JSON and a table of the claims with their dates and status; the status of exp and nbf is judged against the current time, so it can change from one call to the next. Outputs: header (text), payload (text), claims (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JWT: three Base64url parts separated by dots. Required: give the text here or a file path in textFile. |
| `timezone` | string | `"UTC"` | UTC, local or an IANA name such as Europe/Berlin. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indent of the JSON shown: 2 or 4 spaces, a tab, or none for one line. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `encoding__timestamp`

Unix timestamp: Convert epoch seconds or milliseconds to dates, ISO 8601 text to epoch values, or print the current time. Returns a table with one row per value; mode now gives the current time, which changes from one call to the next. Outputs: result (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | Values, one per line: epoch numbers (to-date) or ISO 8601 date-times (to-epoch). Not used by mode now. Give the text here or a file path in textFile. |
| `mode` | `to-date` \| `to-epoch` \| `now` | `"to-date"` | to-date reads epoch numbers, to-epoch reads ISO 8601 text, now prints the current time. |
| `unit` | `auto` \| `seconds` \| `milliseconds` | `"auto"` | to-date: auto reads values below 1e11 as seconds. |
| `timezone` | string | `"UTC"` | UTC, local (the zone of this computer) or an IANA name. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `encoding__url`

URL encode / decode: Percent-encode or strictly decode text as a URL component, a whole URI or a form value. Returns the encoded or decoded text; a malformed escape is an error with its position. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text to encode, or the percent-encoded text to decode. Required: give the text here or a file path in textFile. |
| `mode` | `encode` \| `decode` | `"encode"` | encode turns the input into the encoded form; decode turns it back. |
| `scope` | `component` \| `uri` \| `form` | `"component"` | component escapes every reserved character, uri keeps the characters that structure a URI, form writes spaces as +. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `encoding__uuid`

UUID / GUID generator: Generate version 4 or version 7 UUIDs (also nil and max) in GUID formats. Returns one UUID per line; v4 and v7 values are new on each call. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `version` | `v4` \| `v7` \| `nil` \| `max` | `"v4"` | v4 is random, v7 starts with the current time, nil is all zeros, max is all ones. |
| `count` | integer | `1` | min 1, max 1000; How many UUIDs to generate (1 to 1000). |
| `format` | `standard` \| `compact` \| `braces` \| `parentheses` \| `hex-struct` \| `urn` | `"standard"` | standard 8-4-4-4-12, compact without hyphens, braces {..}, parentheses (..), hex-struct as a C# struct initialiser, urn as urn:uuid:.. |
| `case` | `lower` \| `upper` | `"lower"` | Hexadecimal letters in lower or upper case. |

### `encoding__uuid-inspect`

UUID inspector: Parse UUIDs and GUIDs (one per line) and show version, variant, timestamp and .NET byte order. Returns a table with one row per line. Outputs: uuids (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | UUIDs or GUIDs, one per line, in any common format (hyphens, braces, urn:uuid:). Required: give the text here or a file path in textFile. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

## json-xml

### `json-xml__format-json`

JSON formatter / minifier: Reformat JSON or minify it (indent none). Number and string source text is kept exactly; duplicate keys are kept and reported. Returns the formatted JSON. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON document. Required: give the text here or a file path in textFile. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `json-xml__format-xml`

XML formatter / minifier: Reformat XML or minify it (indent none). Declaration, comments, processing instructions, CDATA and DOCTYPE are kept; mixed content is never altered; entities are never expanded. Returns the formatted XML. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The XML document. Required: give the text here or a file path in textFile. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `json-xml__json-to-xml`

JSON to XML: Convert JSON to XML: @name keys become attributes, #text becomes text, arrays repeat the element; a single top-level key is the root, anything else is wrapped in the root name. Returns the XML document. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON document. Required: give the text here or a file path in textFile. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |
| `rootName` | string | `"root"` | Wrapper element used when the JSON has no single top-level key (default root). |
| `declaration` | boolean | `true` | Write the XML declaration (default on). |
| `sanitizeNames` | boolean | `false` | Rename keys that are not valid XML names instead of failing (default off). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `json-xml__xml-to-json`

XML to JSON: Convert XML to JSON: attributes become @name, text becomes #text, repeated elements become arrays, the root name is the single top-level key. Returns the JSON document. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The XML document. Required: give the text here or a file path in textFile. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |
| `inferTypes` | boolean | `false` | Turn true, false and numbers into JSON values (default off: all values are strings). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

## search

### `search__find-property`

Property search: Finds every occurrence of a property name in a JSON or XML document and lists its path, kind, line, column and value. JSON names are object keys; XML names are element and attribute names as written (a prefix is part of the name). Returns a table with one row per occurrence. Outputs: results (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON or XML document to search. Required: give the text here or a file path in textFile. |
| `query` | string |  | The property name to find; in regex mode a JavaScript regular expression of at most 1000 characters. |
| `mode` | `exact` \| `contains` \| `regex` | `"exact"` | exact: the whole text equals the query (default). contains: the query is a substring. regex: the unanchored regular expression finds a match. |
| `caseSensitive` | boolean | `true` | Default on. Off folds both sides with toLowerCase; in regex mode it adds the i flag. |
| `regexFlags` | string | `""` | Regex mode only: any of i m s u, each at most once. Other flags are refused. |
| `format` | `auto` \| `json` \| `xml` | `"auto"` | auto reads the document as XML when its first non-blank character is <, else as JSON. |
| `xmlTargets` | `both` \| `elements` \| `attributes` | `"both"` | XML only: search element names or text, attribute names or values, or both (default). |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `search__find-value`

Value search: Finds every JSON scalar value, XML attribute value or XML element text that matches, and lists its path, kind, line, column and value. Containers are never matched; formatting whitespace between XML child elements is ignored. Returns a table with one row per match. Outputs: results (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON or XML document to search. Required: give the text here or a file path in textFile. |
| `query` | string |  | The value to find; in regex mode a JavaScript regular expression of at most 1000 characters. |
| `mode` | `exact` \| `contains` \| `regex` | `"exact"` | exact: the whole text equals the query (default). contains: the query is a substring. regex: the unanchored regular expression finds a match. |
| `caseSensitive` | boolean | `true` | Default on. Off folds both sides with toLowerCase; in regex mode it adds the i flag. |
| `regexFlags` | string | `""` | Regex mode only: any of i m s u, each at most once. Other flags are refused. |
| `format` | `auto` \| `json` \| `xml` | `"auto"` | auto reads the document as XML when its first non-blank character is <, else as JSON. |
| `xmlTargets` | `both` \| `elements` \| `attributes` | `"both"` | XML only: search element names or text, attribute names or values, or both (default). |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `search__jsonpath`

JSONPath query: Evaluates a JSONPath query (RFC 9535 without the function extensions length, count, match, search and value) on a JSON document; one row per selected node, in query order. Returns a table with one row per selected node: path, kind, line, column and value. Outputs: results (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON document. Required: give the text here or a file path in textFile. |
| `query` | string | `"$..*"` | For example $.orders[?@.paid == true].id |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `search__xpath`

XPath 1.0 query: Evaluates an XPath 1.0 expression on an XML document. A node-set gives one row per node in document order; a number, string or boolean gives one row with an empty path. Names match by namespace URI and local name: an unprefixed name matches only elements without a namespace. Returns a table with one row per node, or one row for a number, string or boolean. Outputs: results (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The XML document. Required: give the text here or a file path in textFile. |
| `query` | string | `"/*"` | For example //book[@id = "b1"]/title |
| `namespaces` | string | `""` | One prefix=uri per line (at most 100). Prefixes declared on the document element are available without this option; a line here overrides them. |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

## tabular

### `tabular__csv-to-json`

CSV to JSON: Parse CSV (quotes, embedded line breaks, BOM) into JSON: an array of objects keyed by the header, or an array of arrays. Errors carry line and column. Returns the JSON document. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The CSV text. Required: give the text here or a file path in textFile. |
| `delimiter` | `auto` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `header` | boolean | `true` | On: an array of objects. Off: an array of arrays. |
| `inferTypes` | boolean | `false` | Turn true, false, numbers and empty cells into JSON values (default off: all values are strings). |
| `ragged` | `pad` \| `error` | `"pad"` | A record with a different number of fields than the first: pad with a warning, or stop with an error. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `tabular__format-csv`

CSV formatter / converter: Read CSV and write it again in another dialect: delimiter, quoting, line ending, byte order mark. Field values are never changed. Returns the CSV text in the chosen dialect. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The CSV text. Required: give the text here or a file path in textFile. |
| `delimiter` | `auto` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `outputDelimiter` | `same` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"same"` | Field separator of the output (same as the input by default). |
| `outputCustomDelimiter` | string | `""` | The output separator when the output delimiter is custom. |
| `quoteAll` | boolean | `false` | Quote every field, not only those that need it. |
| `lineEnding` | `crlf` \| `lf` | `"crlf"` | Record separator (RFC 4180 uses CRLF). Line breaks inside quoted fields are never changed. |
| `trailingNewline` | boolean | `false` | End the last record with a line break. |
| `bom` | boolean | `false` | Write a UTF-8 byte order mark first (some spreadsheets need it). |
| `escapeFormulas` | boolean | `false` | Prefix ' to text cells that start with =, +, -, @, tab or CR so a spreadsheet does not run them. Changes the data and is not undone by csv-to-json; plain numbers are left alone. A notice reports how many cells qualify either way. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `tabular__json-to-csv`

JSON to CSV: Turn an array of JSON objects into CSV: nested objects become dotted column names, arrays are spread, joined or kept as JSON, number text is written exactly. Returns the CSV text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON document. Required: give the text here or a file path in textFile. |
| `rowsPath` | string | `""` | Dot path to the rows, for example data.items; \. is a literal dot. Empty: the top-level array, else the first array of objects, else one row. For XML it starts below the root element. |
| `arrayMode` | `index` \| `join` \| `json` | `"index"` | Arrays inside a row: one column per item (tags.0), items joined in one cell, or the array as JSON text in one cell. |
| `joinSeparator` | string | `"|"` | Separator used when arrays are joined. |
| `nullText` | string | `""` | Cell text for JSON null (missing values are always empty). |
| `header` | boolean | `true` | Write the header row. |
| `delimiter` | `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `lineEnding` | `crlf` \| `lf` | `"crlf"` | Record separator (RFC 4180 uses CRLF). Line breaks inside quoted fields are never changed. |
| `trailingNewline` | boolean | `false` | End the last record with a line break. |
| `bom` | boolean | `false` | Write a UTF-8 byte order mark first (some spreadsheets need it). |
| `escapeFormulas` | boolean | `false` | Prefix ' to text cells that start with =, +, -, @, tab or CR so a spreadsheet does not run them. Changes the data and is not undone by csv-to-json; plain numbers are left alone. A notice reports how many cells qualify either way. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `tabular__xml-to-csv`

XML to CSV: Turn the repeated elements of an XML document into CSV rows: attributes become @name columns, text becomes #text, nested elements are flattened. Returns the CSV text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The XML document. Required: give the text here or a file path in textFile. |
| `rowsPath` | string | `""` | Dot path to the rows, for example data.items; \. is a literal dot. Empty: the top-level array, else the first array of objects, else one row. For XML it starts below the root element. |
| `arrayMode` | `index` \| `join` \| `json` | `"index"` | Arrays inside a row: one column per item (tags.0), items joined in one cell, or the array as JSON text in one cell. |
| `joinSeparator` | string | `"|"` | Separator used when arrays are joined. |
| `nullText` | string | `""` | Cell text for JSON null (missing values are always empty). |
| `header` | boolean | `true` | Write the header row. |
| `delimiter` | `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `lineEnding` | `crlf` \| `lf` | `"crlf"` | Record separator (RFC 4180 uses CRLF). Line breaks inside quoted fields are never changed. |
| `trailingNewline` | boolean | `false` | End the last record with a line break. |
| `bom` | boolean | `false` | Write a UTF-8 byte order mark first (some spreadsheets need it). |
| `escapeFormulas` | boolean | `false` | Prefix ' to text cells that start with =, +, -, @, tab or CR so a spreadsheet does not run them. Changes the data and is not undone by csv-to-json; plain numbers are left alone. A notice reports how many cells qualify either way. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

## text

### `text__case`

Case converter: Converts text to camelCase, PascalCase, snake_case, kebab-case, UPPER, lower or Title Case. Words split at separators, at lower-to-upper changes and after acronyms (HTTPServer becomes http_server). Locale-free; Title Case uses an English small-word list. Returns the converted text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text to convert. Required: give the text here or a file path in textFile. |
| `style` | `camel` \| `pascal` \| `snake` \| `kebab` \| `upper` \| `lower` \| `title` | `"camel"` | The target style. |
| `perLine` | boolean | `true` | Convert every line on its own and keep the line endings; off converts the whole text as one identifier. |
| `smallWords` | boolean | `true` | Title Case only: keep words such as of, the and to in lower case unless first or last. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `text__diff`

Text diff: Compares two texts line by line or word by word and returns the shortest edit script as a unified diff (or inline word markers), a side-by-side view and a table of changes. Returns the patch, the side-by-side view (the two texts) and the table of changes. Outputs: patch (text), changes (table as CSV); view (unified diff) only with includeDiff.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `original` | string |  | The original text: the - side of the diff. Required: give the text here or a file path in originalFile. |
| `modified` | string |  | The modified text: the + side of the diff. Required: give the text here or a file path in modifiedFile. |
| `granularity` | `line` \| `word` | `"line"` | Whole lines or words. |
| `ignoreWhitespace` | boolean | `false` | Treat runs of whitespace as equal. |
| `ignoreCase` | boolean | `false` | Treat upper and lower case as equal. |
| `ignoreLineEndings` | boolean | `true` | Treat CRLF, LF and CR as equal, so a file converted between systems is not one big change. |
| `context` | integer | `3` | min 0, max 50; Unchanged lines shown around a change in the unified diff. |
| `originalFile` | string |  | Path of a file to read (read-only) instead of "original": UTF-8, or UTF-16 with a byte order mark. |
| `modifiedFile` | string |  | Path of a file to read (read-only) instead of "modified": UTF-8, or UTF-16 with a byte order mark. |
| `includeDiff` | boolean | `false` | Also return a unified diff of the two documents as printed. |

### `text__json-to-yaml`

JSON to YAML: Converts JSON to block-style YAML. Numbers keep their exact text, strings are quoted whenever a YAML 1.1 or 1.2 reader could read them as another type, and duplicate keys keep the last value. Returns the YAML text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The JSON document. Required: give the text here or a file path in textFile. |
| `indent` | `2` \| `4` | `"2"` | Spaces per level. |
| `documents` | `single` \| `split` | `"single"` | single writes one document; split turns a top-level array into --- separated documents. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `text__regex`

Regex tester: Tests a regular expression with JavaScript regular-expression semantics (the engine of this app, not .NET, Java, PCRE or Python) and lists every match with its group captures, or replaces matches with a JavaScript-style replacement ($1, $<name>, $&, $$). Returns a table of the matches, a table of the group captures and, with a replacement, the replaced text. Outputs: matches (table as CSV), groups (table as CSV), replaced (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text to run the regular expression on. Required: give the text here or a file path in textFile. |
| `pattern` | string |  | The regular expression, without slashes or flags. |
| `flags` | string | `"g"` | Any of g (all matches), i (ignore case), m (multi-line), s (dot matches newline), u (Unicode); each at most once. |
| `mode` | `match` \| `replace` | `"match"` | List the matches, or also build the replaced text. |
| `replacement` | string | `""` | Used in replace mode: $1 or $<name> insert groups, $& the match, $$ a dollar sign. |
| `maxMatches` | integer | `1000` | min 1, max 100000; Rows kept in the tables; the total is always counted. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `text__reverse-lines`

Reverse lines: Reverses the order of the lines of a text. Returns the text with its lines in reverse order. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text, one item per line. Required: give the text here or a file path in textFile. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `text__sort-lines`

Sort lines: Sorts the lines of a text. The sort is stable in both directions; the result uses the most frequent line ending of the input. Returns the sorted text. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text, one item per line. Required: give the text here or a file path in textFile. |
| `order` | `asc` \| `desc` | `"asc"` | Ascending or descending. |
| `compare` | `codepoint` \| `locale` | `"codepoint"` | Unicode code point order, or the collation of a locale. |
| `locale` | string | `"en"` | BCP 47 tag used by locale compare, for example de or sv. |
| `natural` | boolean | `false` | Compare digit runs as numbers: a2 before a10. |
| `ignoreCase` | boolean | `false` | Treat upper and lower case as equal. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `text__trim-lines`

Trim lines: Removes leading and trailing whitespace from every line. Returns the trimmed text; line endings are kept. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text, one item per line; leading and trailing whitespace is removed from each. Required: give the text here or a file path in textFile. |
| `side` | `both` \| `left` \| `right` | `"both"` | Which end of each line to trim. |
| `removeEmptyLines` | boolean | `false` | Drop lines that are empty after trimming. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `text__unique-lines`

Remove duplicate lines: Removes repeated lines and keeps the first occurrence, either everywhere or only next to each other. Returns the text without the repeated lines. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The text, one item per line. Required: give the text here or a file path in textFile. |
| `scope` | `all` \| `adjacent` | `"all"` | all removes every repeat; adjacent only removes a line equal to the one before. |
| `ignoreCase` | boolean | `false` | Treat upper and lower case as equal. |
| `ignoreSurroundingSpace` | boolean | `false` | Compare lines without leading and trailing whitespace; the output keeps the original line. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `text__yaml-to-json`

YAML to JSON: Converts YAML to JSON using the YAML 1.2 core schema: yes, no, on and off are strings, only true and false are booleans. Anchors, aliases and merge keys are expanded; comments, tags and styles are dropped. Returns the JSON document. Outputs: result (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | The YAML document. Required: give the text here or a file path in textFile. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | JSON indentation; none writes one line. |
| `documents` | `auto` \| `array` | `"auto"` | auto: one document gives its value, several give an array; array: always an array. |
| `mergeKeys` | boolean | `true` | Apply << merge keys; off keeps << as an ordinary key. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

## units

### `units__catalog`

Unit catalog: List every unit with its id, symbol, name, aliases, exact factor, offset and source document. Returns a table with one row per unit. Outputs: table (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `category` | `all` \| `length` \| `mass` \| `temperature` \| `volume` \| `area` \| `speed` \| `time` \| `data` \| `pressure` \| `energy` \| `angle` | `"all"` | Only the units of one category. |

### `units__convert`

Convert units: Convert a quantity between units of the same category with exact arithmetic (no floating point); temperature uses exact affine factors. Returns the conversion as a sentence with both quantities and units, and the converted number alone. Outputs: result (text), value (text).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | A number and a unit, for example 5 km to mi, 98.6 F in C or 1 GiB = MiB. Required: give the text here or a file path in textFile. |
| `from` | string | `""` | Unit of the number when the text has none, for example km. The text wins when both are given. |
| `to` | string | `""` | Unit to convert to when the text has none. The text wins when both are given. |
| `significantDigits` | integer | `15` | min 1, max 40; Digits shown in the result (1 to 40), rounded half away from zero; trailing zeros are dropped. |
| `notation` | `auto` \| `plain` \| `scientific` | `"auto"` | Notation of the converted value: auto writes plain digits for 0.000001 up to below 1e15 and scientific notation outside that range. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |

### `units__convert-all`

Convert to every unit: Show a quantity in every unit of its category, with a column that says whether each value is exact. Returns a table with one row per unit of the category: name, symbol, value and whether the value is exact. Outputs: table (table as CSV).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | A number and a unit, for example 5 km to mi, 98.6 F in C or 1 GiB = MiB. Required: give the text here or a file path in textFile. |
| `from` | string | `""` | Unit of the number when the text has none, for example km. The text wins when both are given. |
| `significantDigits` | integer | `15` | min 1, max 40; Digits shown in the result (1 to 40), rounded half away from zero; trailing zeros are dropped. |
| `notation` | `auto` \| `plain` \| `scientific` | `"auto"` | Notation of the converted value: auto writes plain digits for 0.000001 up to below 1e15 and scientific notation outside that range. |
| `textFile` | string |  | Path of a file to read (read-only) instead of "text": UTF-8, or UTF-16 with a byte order mark. |
