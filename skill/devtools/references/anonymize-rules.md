# Anonymization rule sets

The anonymize tools (`anonymize__json`, `anonymize__xml`, `anonymize__csv`, `anonymize__text`) take a rule set as a JSON **string** in `rules`. A rule set says what to find and what to do with it. `anonymize__rules` checks a rule set and prints it in canonical form, with every default filled in. Run it first when you write a new set.

## Shape

```json
{
  "version": 1,
  "rules": [
    { "property": "email", "strategy": "pseudonym" },
    { "regex": { "pattern": "\\d{3}-\\d{4}" }, "strategy": "mask" },
    { "path": "user.ssn", "strategy": "remove" }
  ]
}
```

`version` must be the number `1`. Each rule has one **selector** and one **strategy**.

## Selectors: what to find

| Selector | Matches | Use with |
| --- | --- | --- |
| `"literal": "Acme Corp"` | That exact text, wherever it occurs | all formats |
| `"property": "email"` | Every key or element/attribute with that name | JSON, XML |
| `"path": "user.ssn"` | One dot path (`catalog.book.@id` for an XML attribute) | JSON, XML |
| `"regex": { "pattern": "...", "flags": "i" }` | Matches of a JavaScript regular expression. `regex` is an **object**, not a string | all formats |
| `"column": "name"` or `"column": 3` | A CSV column, by header name or by 1-based number | CSV |

`target` defaults to `"value"`; the canonical form shows the other choices.

## Strategies: what to do

The short form is a string (`"mask"`, `"pseudonym"`, `"hash"`, `"remove"`); the long form is an object with options. `fixed` has only the long form, because it needs its `value`.

| Strategy | Effect | Long form |
| --- | --- | --- |
| `"mask"` | Replaces the characters with `*` | `{ "type": "mask", "char": "*", "keepFirst": 0, "keepLast": 4 }`, for example to keep the last 4 digits |
| `{ "type": "fixed", "value": "REDACTED" }` | Replaces with fixed text (object form only: a bare `"fixed"` is refused) | same |
| `"pseudonym"` | A stable fake value, the same for the same input and seed | `{ "type": "pseudonym", "alphabet": "hex", "length": 12, "prefix": "" }` |
| `"hash"` | A keyed hash of the value | `{ "type": "hash", "length": 16 }` |
| `"remove"` | Deletes the field or element | `{ "type": "remove" }` |

`pseudonym` and `hash` are keyed by the call's `seed` argument. The same seed gives the same output. The seed is a secret: ask the user for one when they want repeatable results, and don't invent one and present it as theirs. An empty or short seed makes the values easy to guess.

## Reading the result

The tool reports what it did, for example:

```
info: Replaced 2 value(s), removed 1, renamed 0 key(s)
info: Rule 1 was applied 1 time(s)
```

It also warns about rules that matched nothing, and about literals that are still present after anonymizing. Show those warnings to the user: they usually mean a selector is wrong or sensitive data was missed. The tool does not find sensitive data by itself. It only does what the rules say.

## Example

The user says: "Hide the emails and phone numbers in this JSON and drop the SSN."

```json
{
  "version": 1,
  "rules": [
    { "property": "email", "strategy": "pseudonym" },
    { "property": "phone", "strategy": { "type": "mask", "char": "*", "keepFirst": 0, "keepLast": 2 } },
    { "property": "ssn", "strategy": "remove" }
  ]
}
```

Pass it as a string: `rules: "{\"version\":1,...}"`, together with `text` (the document) and `seed`.
