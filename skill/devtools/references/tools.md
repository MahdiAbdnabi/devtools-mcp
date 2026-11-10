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

Anonymize CSV: Replace cells and headers in CSV, selected by column name or number, driven by a rule set. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `rules` | string |  | **required**; Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |
| `delimiter` | `auto` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator of the input; the output keeps it. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `header` | boolean | `true` | Column names can be used in rules only when this is on. |
| `escapeFormulas` | boolean | `true` | Prefix ' to values written by a rule that start with =, +, -, @, tab or CR so a spreadsheet does not run them. Cells the rules did not change are never altered. |
| `lineEnding` | `crlf` \| `lf` | `"crlf"` | Record separator (RFC 4180 uses CRLF). |
| `trailingNewline` | boolean | `false` | End the last record with a line break. |
| `bom` | boolean | `false` | Write a UTF-8 byte order mark first. |
| `quoteAll` | boolean | `false` | Put every field in quotes. |

### `anonymize__json`

Anonymize JSON: Replace values and keys in JSON with masks, fixed text, consistent pseudonyms, keyed hashes or nothing, driven by a rule set. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `rules` | string |  | **required**; Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation of the printed result. |

### `anonymize__rules`

Check and format a rule set: Validate a rule set and print it in canonical form: defaults filled in, shorthand expanded. Errors name the field and the position.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `rules` | string |  | **required**; Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation of the printed result. |

### `anonymize__text`

Anonymize text: Replace literals and regular-expression matches in plain text, driven by a rule set; line endings and everything outside matches stay as they are. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `rules` | string |  | **required**; Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |

### `anonymize__xml`

Anonymize XML: Replace attribute values, text and names in XML, driven by a rule set. Paths start below the root element. Rules that match nothing and literals that survive are reported; the tool does not find sensitive data by itself.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `rules` | string |  | **required**; Rules that say what to find (literal, property, path, regex, column) and what to do with it (mask, fixed, pseudonym, hash, remove). |
| `seed` | string | `""` | Secret that keys pseudonyms and hashes. The same seed gives the same output; keep it private, it is not saved in rule sets. An empty or short seed makes guessing easy. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation of the printed result. |
| `removeComments` | boolean | `true` | Remove XML comments (they often hold the data you are hiding). |

## codegen

### `codegen__json-to-csharp`

JSON to C# classes: Generate C# classes or records from a JSON sample; a root array merges its elements as samples.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `annotations` | `system-text-json` \| `newtonsoft` \| `none` | `"system-text-json"` | Serializer attributes to write (default system-text-json): System.Text.Json attributes (default), Newtonsoft.Json attributes, No annotations. |
| `style` | `class` \| `record` | `"class"` | Classes with properties (default) or positional records. |
| `namespace` | string | `"Generated"` | C# namespace of the generated code (default Generated); empty writes none. |
| `rootName` | string | `"Root"` | Name of the root class (default Root). |
| `nullableReferenceTypes` | boolean | `true` | Write #nullable enable and string? for optional members (default on). |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |

### `codegen__json-to-java`

JSON to Java classes: Generate Java POJOs or records from a JSON sample; every class is nested in the root class.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `annotations` | `jackson` \| `none` | `"jackson"` | Serializer attributes to write (default jackson): Jackson annotations (default), No annotations. |
| `style` | `class` \| `record` | `"class"` | POJO classes (default) or records (Java 16 or newer). |
| `lombok` | boolean | `false` | Write @Data instead of getters and setters (default off); ignored for records. |
| `package` | string | `"generated"` | Java package of the generated code (default generated); empty writes none. |
| `rootName` | string | `"Root"` | Name of the root class (default Root). |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |

### `codegen__xml-to-csharp`

XML to C# classes: Generate C# classes or records from an XML sample: attributes and text become properties, repeated elements become lists.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `annotations` | `xml-serializer` \| `none` | `"xml-serializer"` | Serializer attributes to write (default xml-serializer): XmlSerializer attributes (default), No annotations. |
| `style` | `class` \| `record` | `"class"` | Classes with properties (default) or positional records. |
| `namespace` | string | `"Generated"` | C# namespace of the generated code (default Generated); empty writes none. |
| `rootName` | string | `""` | Name of the root class (default empty: the root element name). |
| `inferTypes` | boolean | `true` | Type text values as numbers and booleans (default on); off makes them strings. |
| `nullableReferenceTypes` | boolean | `true` | Write #nullable enable and string? for optional members (default on). |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |

### `codegen__xml-to-java`

XML to Java classes: Generate Java POJOs or records from an XML sample: attributes and text become fields, repeated elements become lists.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `annotations` | `jackson-xml` \| `none` | `"jackson-xml"` | Serializer attributes to write (default jackson-xml): Jackson XML annotations (default), No annotations. |
| `style` | `class` \| `record` | `"class"` | POJO classes (default) or records (Java 16 or newer). |
| `lombok` | boolean | `false` | Write @Data instead of getters and setters (default off); ignored for records. |
| `package` | string | `"generated"` | Java package of the generated code (default generated); empty writes none. |
| `rootName` | string | `""` | Name of the root class (default empty: the root element name). |
| `inferTypes` | boolean | `true` | Type text values as numbers and booleans (default on); off makes them strings. |
| `dates` | boolean | `false` | ISO-8601 strings become date types (default off). |
| `naming` | `convention` \| `preserve` | `"convention"` | convention recases names (default); preserve: keep key text where it is a valid identifier. |
| `dedupe` | boolean | `true` | Objects with the same members share one class (default on). |

## compare

### `compare__csv`

Compare CSV: Compare 2 to 20 CSV documents with a base. The first record is the header; rows can be matched by key columns.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `documents` | array of strings |  | **required**; Two to twenty documents; every one is compared with the base. |
| `names` | array of strings |  | Optional labels, one per document. |
| `mode` | `values` \| `structure` | `"values"` | Compare the values, or only the keys and the value types. |
| `base` | integer | `1` | min 1, max 20; Which document is the reference; every other document is compared with it. |
| `key` | string | `""` | Match array items (and CSV rows) by these fields instead of by position: id or id, sku. Items must carry every field as a plain value. |
| `ignoreOrder` | boolean | `false` | Treat arrays without a key as sets: the same items in another order are equal. |
| `ignorePaths` | string | `""` | Dot paths to leave out, one per line (or separated by ;): items.price, catalog.book.@id. Array positions are skipped. |
| `maxDiffs` | integer | `1000` | min 1, max 100000; Most differences listed per document; all are still counted. |
| `delimiter` | `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` \| `auto` | `"comma"` | Field separator; auto detects it for each document. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `inferTypes` | boolean | `false` | Read true, false and number text as booleans and numbers instead of strings. |

### `compare__json`

Compare JSON: Compare 2 to 20 JSON documents with a base by values or by structure, with arrays matched by key or in any order.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `documents` | array of strings |  | **required**; Two to twenty documents; every one is compared with the base. |
| `names` | array of strings |  | Optional labels, one per document. |
| `mode` | `values` \| `structure` | `"values"` | Compare the values, or only the keys and the value types. |
| `base` | integer | `1` | min 1, max 20; Which document is the reference; every other document is compared with it. |
| `key` | string | `""` | Match array items (and CSV rows) by these fields instead of by position: id or id, sku. Items must carry every field as a plain value. |
| `ignoreOrder` | boolean | `false` | Treat arrays without a key as sets: the same items in another order are equal. |
| `ignorePaths` | string | `""` | Dot paths to leave out, one per line (or separated by ;): items.price, catalog.book.@id. Array positions are skipped. |
| `maxDiffs` | integer | `1000` | min 1, max 100000; Most differences listed per document; all are still counted. |

### `compare__xml`

Compare XML: Compare 2 to 20 XML documents with a base by values or by structure. Repeated elements can be matched by @attribute or by a child element holding only text.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `documents` | array of strings |  | **required**; Two to twenty documents; every one is compared with the base. |
| `names` | array of strings |  | Optional labels, one per document. |
| `mode` | `values` \| `structure` | `"values"` | Compare the values, or only the keys and the value types. |
| `base` | integer | `1` | min 1, max 20; Which document is the reference; every other document is compared with it. |
| `key` | string | `""` | Match array items (and CSV rows) by these fields instead of by position: id or id, sku. Items must carry every field as a plain value. |
| `ignoreOrder` | boolean | `false` | Treat arrays without a key as sets: the same items in another order are equal. |
| `ignorePaths` | string | `""` | Dot paths to leave out, one per line (or separated by ;): items.price, catalog.book.@id. Array positions are skipped. |
| `maxDiffs` | integer | `1000` | min 1, max 100000; Most differences listed per document; all are still counted. |
| `inferTypes` | boolean | `false` | Read true, false and number text as booleans and numbers instead of strings. |

## datetime

### `datetime__convert`

Convert date patterns: Convert patterns between C# and Java; every token that does not render identically is flagged with the reason.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `patterns` | string |  | **required**; Patterns in the source language, one per line. Blank lines are skipped; at most 200 patterns of 1000 characters. |
| `instant` | string |  | Optional: render both patterns at this instant to see the difference. ISO 8601 with an offset. |
| `direction` | `csharp-to-java` \| `java-to-csharp` | `"csharp-to-java"` | Which language the patterns are written in. |

### `datetime__csharp`

C# date format: Render an instant with C# standard and custom format strings under InvariantCulture, as .NET does.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `instant` | string |  | **required**; ISO 8601 with an offset, for example 2024-03-05T14:07:09.1203456+05:30 or ...Z. Named time zones are not supported. |
| `patterns` | string |  | **required**; C# format strings (an empty text renders the default ToString() format), one per line. Blank lines are skipped; at most 200 patterns of 1000 characters. |
| `valueKind` | `offset` \| `utc` | `"offset"` | offset is a DateTimeOffset (the format U throws); utc is a UTC DateTime (K prints Z, U works). |

### `datetime__java`

Java date format: Render an instant with Java DateTimeFormatter patterns for Locale.US, with JDK 8 behaviour.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `instant` | string |  | **required**; ISO 8601 with an offset, for example 2024-03-05T14:07:09.1203456+05:30 or ...Z. Named time zones are not supported. |
| `patterns` | string |  | **required**; Java DateTimeFormatter patterns, one per line. Blank lines are skipped; at most 200 patterns of 1000 characters. |
| `zone` | `offset` \| `UTC` | `"offset"` | offset keeps the offset of the instant (a ZoneOffset); UTC converts it to the UTC region. |

### `datetime__reference`

Date format reference: Search every C# and Java date-time specifier; the example column is rendered by the real formatter at a fixed instant.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `filter` | string |  | Text to find in any column, ignoring case. It is matched literally, not as a pattern. |
| `platform` | `all` \| `csharp` \| `java` | `"all"` | Only the specifiers of one language. |
| `kind` | `all` \| `standard` \| `custom` \| `letter` \| `syntax` | `"all"` | standard and custom are C#; letter is Java; syntax covers quotes, escapes, optional sections and padding. |

## encoding

### `encoding__base64`

Base64 (text and objects): Encode text, JSON or XML to Base64, or decode Base64 back (strict, standard or URL-safe alphabet).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `mode` | `encode` \| `decode` | `"encode"` |  |
| `source` | `text` \| `json` \| `xml` | `"text"` | json and xml are parsed first: encode writes them minified, decode formats them. |
| `variant` | `standard` \| `url` | `"standard"` | standard uses + and /, url uses - and _ (RFC 4648 section 5). |
| `padding` | boolean | `true` | Write the = padding on encode. |
| `lineLength` | `0` \| `64` \| `76` | `"0"` | Wrap the encoded text at this width (0 = one line, 76 = MIME). |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Decode of json and xml. |
| `binary` | `error` \| `hex` | `"error"` | What decode does when the bytes are not UTF-8 text: report an error or show a hex view. |

### `encoding__base64-file`

Base64 (file): Encode a file to Base64 text, or decode a Base64 file to text or to a new file (binary safe).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `file` | string |  | **required**; Path of a file to read (read-only). |
| `mode` | `encode` \| `decode` | `"encode"` |  |
| `variant` | `standard` \| `url` | `"standard"` | standard uses + and /, url uses - and _ (RFC 4648 section 5). |
| `padding` | boolean | `true` | Write the = padding on encode. |
| `lineLength` | `0` \| `64` \| `76` | `"0"` | Wrap the encoded text at this width (0 = one line, 76 = MIME). |
| `overwrite` | boolean | `false` | Replace the output file when it already exists. |
| `binary` | `error` \| `hex` | `"hex"` |  |

### `encoding__hash`

Hash (text): MD5, SHA-1, SHA-256 and SHA-512 of text (UTF-8).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `algorithm` | `all` \| `md5` \| `sha1` \| `sha256` \| `sha512` | `"all"` |  |
| `format` | `hex` \| `base64` | `"hex"` |  |
| `uppercase` | boolean | `false` |  |

### `encoding__hash-file`

Hash (file): MD5, SHA-1, SHA-256 and SHA-512 of a file, streamed.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `file` | string |  | **required**; Path of a file to read (read-only). |
| `algorithm` | `all` \| `md5` \| `sha1` \| `sha256` \| `sha512` | `"all"` |  |
| `format` | `hex` \| `base64` | `"hex"` |  |
| `uppercase` | boolean | `false` |  |

### `encoding__html`

HTML entities: Encode text to HTML entities or decode named (HTML 4.01) and numeric references.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `mode` | `encode` \| `decode` | `"encode"` |  |
| `scope` | `minimal` \| `non-ascii` | `"minimal"` |  |
| `numeric` | `hex` \| `decimal` | `"hex"` | Notation for characters without a name (non-ascii scope). |

### `encoding__jwt`

JWT decoder (no verification): Decode the header and payload of a JWT and show its dates. The signature is never verified.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `timezone` | string | `"UTC"` | UTC, local or an IANA name such as Europe/Berlin. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` |  |

### `encoding__timestamp`

Unix timestamp: Convert epoch seconds or milliseconds to dates, ISO 8601 text to epoch values, or print the current time.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  |  |
| `mode` | `to-date` \| `to-epoch` \| `now` | `"to-date"` |  |
| `unit` | `auto` \| `seconds` \| `milliseconds` | `"auto"` | to-date: auto reads values below 1e11 as seconds. |
| `timezone` | string | `"UTC"` | UTC, local (the zone of this computer) or an IANA name. |

### `encoding__url`

URL encode / decode: Percent-encode or strictly decode text as a URL component, a whole URI or a form value.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `mode` | `encode` \| `decode` | `"encode"` |  |
| `scope` | `component` \| `uri` \| `form` | `"component"` |  |

### `encoding__uuid`

UUID / GUID generator: Generate version 4 or version 7 UUIDs (also nil and max) in GUID formats.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `version` | `v4` \| `v7` \| `nil` \| `max` | `"v4"` |  |
| `count` | integer | `1` | min 1, max 1000 |
| `format` | `standard` \| `compact` \| `braces` \| `parentheses` \| `hex-struct` \| `urn` | `"standard"` |  |
| `case` | `lower` \| `upper` | `"lower"` |  |

### `encoding__uuid-inspect`

UUID inspector: Parse UUIDs and GUIDs (one per line) and show version, variant, timestamp and .NET byte order.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |

## json-xml

### `json-xml__format-json`

JSON formatter / minifier: Reformat JSON or minify it (indent none). Number and string source text is kept exactly; duplicate keys are kept and reported.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |

### `json-xml__format-xml`

XML formatter / minifier: Reformat XML or minify it (indent none). Declaration, comments, processing instructions, CDATA and DOCTYPE are kept; mixed content is never altered; entities are never expanded.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |

### `json-xml__json-to-xml`

JSON to XML: Convert JSON to XML: @name keys become attributes, #text becomes text, arrays repeat the element; a single top-level key is the root, anything else is wrapped in the root name.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |
| `rootName` | string | `"root"` | Wrapper element used when the JSON has no single top-level key (default root). |
| `declaration` | boolean | `true` | Write the XML declaration (default on). |
| `sanitizeNames` | boolean | `false` | Rename keys that are not valid XML names instead of failing (default off). |

### `json-xml__xml-to-json`

XML to JSON: Convert XML to JSON: attributes become @name, text becomes #text, repeated elements become arrays, the root name is the single top-level key.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |
| `inferTypes` | boolean | `false` | Turn true, false and numbers into JSON values (default off: all values are strings). |

## search

### `search__find-property`

Property search: Finds every occurrence of a property name in a JSON or XML document and lists its path, kind, line, column and value. JSON names are object keys; XML names are element and attribute names as written (a prefix is part of the name).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `query` | string |  | The property name to find; in regex mode a JavaScript regular expression of at most 1000 characters. |
| `mode` | `exact` \| `contains` \| `regex` | `"exact"` | exact: the whole text equals the query (default). contains: the query is a substring. regex: the unanchored regular expression finds a match. |
| `caseSensitive` | boolean | `true` | Default on. Off folds both sides with toLowerCase; in regex mode it adds the i flag. |
| `regexFlags` | string | `""` | Regex mode only: any of i m s u, each at most once. Other flags are refused. |
| `format` | `auto` \| `json` \| `xml` | `"auto"` | auto reads the document as XML when its first non-blank character is <, else as JSON. |
| `xmlTargets` | `both` \| `elements` \| `attributes` | `"both"` | XML only: search element names or text, attribute names or values, or both (default). |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |

### `search__find-value`

Value search: Finds every JSON scalar value, XML attribute value or XML element text that matches, and lists its path, kind, line, column and value. Containers are never matched; formatting whitespace between XML child elements is ignored.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `query` | string |  | The value to find; in regex mode a JavaScript regular expression of at most 1000 characters. |
| `mode` | `exact` \| `contains` \| `regex` | `"exact"` | exact: the whole text equals the query (default). contains: the query is a substring. regex: the unanchored regular expression finds a match. |
| `caseSensitive` | boolean | `true` | Default on. Off folds both sides with toLowerCase; in regex mode it adds the i flag. |
| `regexFlags` | string | `""` | Regex mode only: any of i m s u, each at most once. Other flags are refused. |
| `format` | `auto` \| `json` \| `xml` | `"auto"` | auto reads the document as XML when its first non-blank character is <, else as JSON. |
| `xmlTargets` | `both` \| `elements` \| `attributes` | `"both"` | XML only: search element names or text, attribute names or values, or both (default). |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |

### `search__jsonpath`

JSONPath query: Evaluates a JSONPath query (RFC 9535 without the function extensions length, count, match, search and value) on a JSON document; one row per selected node, in query order.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `query` | string | `"$..*"` | For example $.orders[?@.paid == true].id |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |

### `search__xpath`

XPath 1.0 query: Evaluates an XPath 1.0 expression on an XML document. A node-set gives one row per node in document order; a number, string or boolean gives one row with an empty path. Names match by namespace URI and local name: an unprefixed name matches only elements without a namespace.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `query` | string | `"/*"` | For example //book[@id = "b1"]/title |
| `namespaces` | string | `""` | One prefix=uri per line (at most 100). Prefixes declared on the document element are available without this option; a line here overrides them. |
| `maxResults` | integer | `1000` | min 1, max 100000; At most this many rows are listed (default 1000, up to 100000); the total number of matches is always reported. |
| `previewLength` | integer | `200` | min 10, max 2000; A value longer than this many UTF-16 units is shortened and ends with … (default 200, 10 to 2000). Line breaks show as escapes. |

## tabular

### `tabular__csv-to-json`

CSV to JSON: Parse CSV (quotes, embedded line breaks, BOM) into JSON: an array of objects keyed by the header, or an array of arrays. Errors carry line and column.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `delimiter` | `auto` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `header` | boolean | `true` | On: an array of objects. Off: an array of arrays. |
| `inferTypes` | boolean | `false` | Turn true, false, numbers and empty cells into JSON values (default off: all values are strings). |
| `ragged` | `pad` \| `error` | `"pad"` | A record with a different number of fields than the first: pad with a warning, or stop with an error. |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | Indentation: 2 spaces (default), 4 spaces, tab, or none (minified). |

### `tabular__format-csv`

CSV formatter / converter: Read CSV and write it again in another dialect: delimiter, quoting, line ending, byte order mark. Field values are never changed.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `delimiter` | `auto` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"comma"` | Field separator. |
| `customDelimiter` | string | `""` | The separator when delimiter is custom: one character that is not a quote or a line break. |
| `outputDelimiter` | `same` \| `comma` \| `semicolon` \| `tab` \| `pipe` \| `custom` | `"same"` | Field separator of the output (same as the input by default). |
| `outputCustomDelimiter` | string | `""` | The output separator when the output delimiter is custom. |
| `quoteAll` | boolean | `false` | Quote every field, not only those that need it. |
| `lineEnding` | `crlf` \| `lf` | `"crlf"` | Record separator (RFC 4180 uses CRLF). Line breaks inside quoted fields are never changed. |
| `trailingNewline` | boolean | `false` | End the last record with a line break. |
| `bom` | boolean | `false` | Write a UTF-8 byte order mark first (some spreadsheets need it). |
| `escapeFormulas` | boolean | `false` | Prefix ' to text cells that start with =, +, -, @, tab or CR so a spreadsheet does not run them. Changes the data and is not undone by csv-to-json; plain numbers are left alone. A notice reports how many cells qualify either way. |

### `tabular__json-to-csv`

JSON to CSV: Turn an array of JSON objects into CSV: nested objects become dotted column names, arrays are spread, joined or kept as JSON, number text is written exactly.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
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

### `tabular__xml-to-csv`

XML to CSV: Turn the repeated elements of an XML document into CSV rows: attributes become @name columns, text becomes #text, nested elements are flattened.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
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

## text

### `text__case`

Case converter: Converts text to camelCase, PascalCase, snake_case, kebab-case, UPPER, lower or Title Case. Words split at separators, at lower-to-upper changes and after acronyms (HTTPServer becomes http_server). Locale-free; Title Case uses an English small-word list.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `style` | `camel` \| `pascal` \| `snake` \| `kebab` \| `upper` \| `lower` \| `title` | `"camel"` | The target style. |
| `perLine` | boolean | `true` | Convert every line on its own and keep the line endings; off converts the whole text as one identifier. |
| `smallWords` | boolean | `true` | Title Case only: keep words such as of, the and to in lower case unless first or last. |

### `text__diff`

Text diff: Compares two texts line by line or word by word and returns the shortest edit script as a unified diff (or inline word markers), a side-by-side view and a table of changes.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `original` | string |  | **required** |
| `modified` | string |  | **required** |
| `granularity` | `line` \| `word` | `"line"` | Whole lines or words. |
| `ignoreWhitespace` | boolean | `false` | Treat runs of whitespace as equal. |
| `ignoreCase` | boolean | `false` | Treat upper and lower case as equal. |
| `ignoreLineEndings` | boolean | `true` | Treat CRLF, LF and CR as equal, so a file converted between systems is not one big change. |
| `context` | integer | `3` | min 0, max 50; Unchanged lines shown around a change in the unified diff. |

### `text__json-to-yaml`

JSON to YAML: Converts JSON to block-style YAML. Numbers keep their exact text, strings are quoted whenever a YAML 1.1 or 1.2 reader could read them as another type, and duplicate keys keep the last value.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `indent` | `2` \| `4` | `"2"` | Spaces per level. |
| `documents` | `single` \| `split` | `"single"` | single writes one document; split turns a top-level array into --- separated documents. |

### `text__regex`

Regex tester: Tests a regular expression with JavaScript regular-expression semantics (the engine of this app, not .NET, Java, PCRE or Python) and lists every match with its group captures, or replaces matches with a JavaScript-style replacement ($1, $<name>, $&, $$).

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `pattern` | string |  | The regular expression, without slashes or flags. |
| `flags` | string | `"g"` | Any of g (all matches), i (ignore case), m (multi-line), s (dot matches newline), u (Unicode); each at most once. |
| `mode` | `match` \| `replace` | `"match"` | List the matches, or also build the replaced text. |
| `replacement` | string | `""` | Used in replace mode: $1 or $<name> insert groups, $& the match, $$ a dollar sign. |
| `maxMatches` | integer | `1000` | min 1, max 100000; Rows kept in the tables; the total is always counted. |

### `text__reverse-lines`

Reverse lines: Reverses the order of the lines of a text.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |

### `text__sort-lines`

Sort lines: Sorts the lines of a text. The sort is stable in both directions; the result uses the most frequent line ending of the input.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `order` | `asc` \| `desc` | `"asc"` | Ascending or descending. |
| `compare` | `codepoint` \| `locale` | `"codepoint"` | Unicode code point order, or the collation of a locale. |
| `locale` | string | `"en"` | BCP 47 tag used by locale compare, for example de or sv. |
| `natural` | boolean | `false` | Compare digit runs as numbers: a2 before a10. |
| `ignoreCase` | boolean | `false` | Treat upper and lower case as equal. |

### `text__trim-lines`

Trim lines: Removes leading and trailing whitespace from every line.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `side` | `both` \| `left` \| `right` | `"both"` | Which end of each line to trim. |
| `removeEmptyLines` | boolean | `false` | Drop lines that are empty after trimming. |

### `text__unique-lines`

Remove duplicate lines: Removes repeated lines and keeps the first occurrence, either everywhere or only next to each other.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `scope` | `all` \| `adjacent` | `"all"` | all removes every repeat; adjacent only removes a line equal to the one before. |
| `ignoreCase` | boolean | `false` | Treat upper and lower case as equal. |
| `ignoreSurroundingSpace` | boolean | `false` | Compare lines without leading and trailing whitespace; the output keeps the original line. |

### `text__yaml-to-json`

YAML to JSON: Converts YAML to JSON using the YAML 1.2 core schema: yes, no, on and off are strings, only true and false are booleans. Anchors, aliases and merge keys are expanded; comments, tags and styles are dropped.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required** |
| `indent` | `2` \| `4` \| `tab` \| `none` | `"2"` | JSON indentation; none writes one line. |
| `documents` | `auto` \| `array` | `"auto"` | auto: one document gives its value, several give an array; array: always an array. |
| `mergeKeys` | boolean | `true` | Apply << merge keys; off keeps << as an ordinary key. |

## units

### `units__catalog`

Unit catalog: List every unit with its id, symbol, name, aliases, exact factor, offset and source document.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `category` | `all` \| `length` \| `mass` \| `temperature` \| `volume` \| `area` \| `speed` \| `time` \| `data` \| `pressure` \| `energy` \| `angle` | `"all"` | Only the units of one category. |

### `units__convert`

Convert units: Convert a quantity between units of the same category with exact arithmetic (no floating point); temperature uses exact affine factors.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required**; A number and a unit, for example 5 km to mi, 98.6 F in C or 1 GiB = MiB. |
| `from` | string | `""` | Unit of the number when the text has none, for example km. The text wins when both are given. |
| `to` | string | `""` | Unit to convert to when the text has none. The text wins when both are given. |
| `significantDigits` | integer | `15` | min 1, max 40; Digits shown in the result (1 to 40), rounded half away from zero; trailing zeros are dropped. |
| `notation` | `auto` \| `plain` \| `scientific` | `"auto"` | auto writes plain digits for 0.000001 up to below 1e15 and scientific notation outside that range. |

### `units__convert-all`

Convert to every unit: Show a quantity in every unit of its category, with a column that says whether each value is exact.

| Argument | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string |  | **required**; A number and a unit, for example 5 km to mi, 98.6 F in C or 1 GiB = MiB. |
| `from` | string | `""` | Unit of the number when the text has none, for example km. The text wins when both are given. |
| `significantDigits` | integer | `15` | min 1, max 40; Digits shown in the result (1 to 40), rounded half away from zero; trailing zeros are dropped. |
| `notation` | `auto` \| `plain` \| `scientific` | `"auto"` | auto writes plain digits for 0.000001 up to below 1e15 and scientific notation outside that range. |
