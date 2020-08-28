# string-style-html

Converts a **string** and a simple '**style**'-instructions string,
to **HTML** code that has styling tags inserted.  
It also HTML-encodes any `&`, `<`, and `>` characters in the string,
so they don't interfere with any inserted style tags.

This functionality is used by both
[`vsm-autocomplete`](https://github.com/vsm/vsm-autocomplete) and
[`vsm-box`](https://github.com/vsm/vsm-box).


## Specification

This package provides a function `f(str, style, extraContent)`.  
All arguments are Strings, and the last two are optional.

- If `style` is not given, or a not String, or `''`,
  then it returns `str` unchanged.  
  + E.g. `f('abcd', '')` returns `'abcd'`.
- If `style` is a String that contains a `'<'`, then it is supposed to hold
  a styled version of `str`, with HTML-tags already inserted.
  In this case it returns `style`.
  + E.g. `f('abcd', 'a<i>bc</i>d')` returns `'a<i>bc</i>d'`.
- Else it returns `str`, with HTML styling tags inserted:<br>
  - If `style` is the single character `'i'`, `'b'`, `'s'`, or `'u'`, then
    it applies the italic, bold, subscript, or superscript style resp.,
    to the entire string.  
    + E.g. `f('abcd', 'i')` returns `'<i>abcd</i>'`.<br><br>
  - `style` can also include a range '{startIndex}-{stopIndex}' that says
    which part of the string should be styled.
    E.g. `'i0-3'` applies italic to the first three characters of `str`.  
    Indexes count from 0, and `stopIndex` is the location just before where
    styling stops.
    + E.g. `f('abcd', 'i1-3')` returns `'a<i>bc</i>d'`.<br><br>
  - `style` can also include a single index for a one-character range.
    + E.g. `f('abcd', 'i2')` returns `'ab<i>c</i>d'`.<br><br>
  - `style` can include multiple styling instructions, separated by a `;`.  
    (Note: overlapping ranges are handled correctly, see
    [index.test.js](src/index.test.js)).
    + E.g. `f('abcd', 'i1;u2-4')`
      returns `'a<i>b</i><sup>cd</sup>'`.<br><br>

- It html-encodes `<`, `>`, and `&` (also if no `style` is given).
  + E.g. `f('<b&d>', 'b2')`
    returns `'&lt;b<b>&amp;</b>d&gt;'`.<br><br>

- If given an `extraContent` argument,
  it adds that extra content to inserted opening-tags.
  + E.g. `f('abc', 'i', 'style="pointer-events: none;"')` returns
    `'<i style="pointer-events: none;">abc</i>'`.


## Example Use

```
const stringStyleHtml = require('string-style-html');

console.dir( stringStyleHtml('cdc2', 'i') );
// => '<i>cdc2</i>'.

console.dir( stringStyleHtml('Ca2+', 'u2-4') );
// => 'Ca<sup>2+</sup>'.

console.dir( stringStyleHtml('HCO3-', 's3;u4') );
// =>'HCO<sub>3</sub><sup>-</sup>'.

console.dir( stringStyleHtml('abc', 'ab<span style="color: #f00;">c</span>') );
// =>'ab<span style="color: #f00;">c</span>'.
```

## License

This project is licensed under the AGPL license - see [LICENSE.md](LICENSE.md).
