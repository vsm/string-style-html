# string-style-html

Converts a ***string*** and a simple '***style***'-instructions string,
to ***HTML*** code that has styling tags inserted.  
It also HTML-encodes the characters `&`, `<`, and `>`.

This functionality is used by both
[`vsm-autocomplete`](https://github.com/vsmjs/vsm-autocomplete) and
[`vsm-box`](https://github.com/vsmjs/vsm-box).


## Specification

This package provides a function `f(str, style, extraContent)`.  
All arguments are strings, while the last two are optional.

- If `style` is not given or `''`, then it returns `str` unchanged.  
  Else it returns `str`, with HTML styling tags inserted:<br><br>
  - If `style` is the single character `'i'`, `'b'`, `'s'`, or `'u'`, then
    it applies the italic, bold, subscript, or superscript style resp.,
    to the entire string.  
    + E.g. `f('abcd', 'i')` returns `<i>abcd</i>`.<br><br>
  - `style` can also include a range `{startIndex}-{stopIndex}` that says
    which part of the string should be styled.
    E.g. `'i0-3'` applies italic to the first three characters of `str`.  
    So indexes count from 0, and `stopIndex` is where styling stops before.
    + E.g. `f('abcd', 'i1-3')` returns `a<i>bc</i>d`.<br><br>
  - `style` can also include a single index for a one-character range.
    + E.g. `f('abcd', 'i2')` returns `ab<i>c</i>d`.<br><br>
  - `style` can include multiple styling instructions, separated by a `;`.  
    (Note: overlapping ranges are handled correctly, see
    [index.test.js](src/index.test.js)).
    + E.g. `f('abcd', 'i1;u2-4')`
      returns `a<i>b</i><sup>cd</sup>`.<br><br>

- It html-encodes `<`, `>`, and `&`.
  + E.g. `f('<b&d>', 'b2')`
    returns `&lt;b<b>&amp;</b>d&gt;`.<br><br>

- If given an `extraContent` argument,
  it adds that extra content to inserted opening-tags.
  + E.g. `f('abc', 'i', 'style="pointer-events: none;"')` returns
    `<i style="pointer-events: none;">abc</i>`.


## Example Use

```
const stringStyleHtml = require('string-style-html');

console.dir( stringStyleHtml('cdc2', 'i') );
// => '<i>cdc2</i>'.

console.dir( stringStyleHtml('Ca2+', 'u2-4') );
// => 'Ca<sup>2+</sup>'.

console.dir( stringStyleHtml('HCO3-', 's3;u4') );
// =>'HCO<sub>3</sub><sup>-</sup>'.
```
