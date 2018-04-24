var stylePartRegex = /^([bisu])(?:(\d+)(?:-(\d+))?)?$/;
var typesToTags = {
  b: 'b',
  i: 'i',
  s: 'sub',
  u: 'sup'
};


module.exports = function stringStyleHtml(str, style, extraTagContent) {
  if (!style)  return str;

  var styleParts = style.split(';');
  var stylePrefixes =  // Prefixes to insert before str's chars. Last is postfix.
    Array.from({length: str.length + 1}, () => '');
  var openTagTail = (extraTagContent ? (' ' + extraTagContent) : '') + '>';

  styleParts.forEach(sty => { // E.g.: style='b;i2-3' => for sty= 'b' and 'i2-3'.
    var match = sty.match(stylePartRegex);
    if (!match)  return;
    var [, type, start, stop] = match;

    type = typesToTags[type];

    if (start === undefined)  { start = 0;  stop = str.length; }
    else if (stop === undefined)  stop = Number(start) + 1;
    start = Number(start);
    stop  = Number(stop);

    if (stop < start)  { var x = start;  start = stop;  stop = x; }
    if (start >= str.length)  return;
    stop = Math.min(stop, str.length);

    var openTag  = '<'  + type + openTagTail;
    var closeTag = '</' + type + '>';
    stylePrefixes[start] = stylePrefixes[start] + openTag;
    for (var i = start + 1; i < stop; i++) {   // Prevent overlapping blocks, ..
      if (stylePrefixes[i] != '') {    // ..and nest new blocks in earlier ones.
        stylePrefixes[i] = closeTag + stylePrefixes[i] + openTag;
      }
    }
    stylePrefixes[stop] = closeTag + stylePrefixes[stop];
  });

  return (
    str
      .split('')
      .map((char, i) => stylePrefixes[i] + htmlEncode(char)) )
    .join('') +
    stylePrefixes[str.length];
};



function htmlEncode(str) {  // Safely encodes a possibly unsafe string.
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
