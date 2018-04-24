const stringStyleHtml = require('./index.js');
const chai = require('chai');
chai.should();


describe.only('stringStyleHtml()', function() {

  it('does not modify a string when not given a `style` argument', () => {
    stringStyleHtml('abc').should.equal('abc');
  });

  it('applies a style to a whole string', () => {
    stringStyleHtml('cdc2', 'i').should.equal('<i>cdc2</i>');
  });

  it('applies a style to a part of a string', () => {
    stringStyleHtml('abcde', 'b1-3').should.equal('a<b>bc</b>de');
  });

  it('applies a style to a part of a string (2)', () => {
    stringStyleHtml('Ca2+', 'u2-4').should.equal('Ca<sup>2+</sup>');
  });

  it('applies a style one character of a string', () => {
    stringStyleHtml('abcde', 'b2').should.equal('ab<b>c</b>de');
  });

  it('applies multiple style instructions to a string', () => {
    stringStyleHtml('Na+Cl-', 'u2-3;u5').should.equal(
      'Na<sup>+</sup>Cl<sup>-</sup>');
  });

  it('applies all supported styles to a string: ' +
    '\'italic\', \'bold\', \'subscript\', \'superscript\'', () => {
    stringStyleHtml('aaaa', 'i0;b1;s2;u3').should.equal(
      '<i>a</i><b>a</b><sub>a</sub><sup>a</sup>');
  });

  it('works on a more complex case', () => {
    stringStyleHtml('HCO3- ⇌ CO32- + H+', 's3;u4;s10;u11-13;u17').should.equal(
      'HCO<sub>3</sub><sup>-</sup> ⇌ CO<sub>3</sub><sup>2-</sup> + H<sup>+</sup>'
    );
  });

  it('applies overlapping style ranges correctly', () => {
    stringStyleHtml('x--==--x', 'i1-5;b3-7').should.equal(
      'x<i>--<b>==</b></i><b>--</b>x');
  });

  it('corrects an inverse range', () => {
    stringStyleHtml('abcde', 'b3-1').should.equal('a<b>bc</b>de');
  });

  it('correctly & efficiently styles a string that is shorter than ' +
    'style instruction ranges', () => {
    stringStyleHtml('ab', 'b1-20;i5').should.equal('a<b>b</b>');
  });

  it('ignores invalid style-parts', () => {
    stringStyleHtml('Na+Cl-', 'u2-3;; ;,;xyz;xyz5-3;u5').should.equal(
      'Na<sup>+</sup>Cl<sup>-</sup>');
  });

  it('html-encodes \'<\', \'>\', and \'&\'', () => {
    stringStyleHtml('<b&d>', 'b2').should.equal('&lt;b<b>&amp;</b>d&gt;');
  });

  it('adds extra content to inserted tags, via argument 3', () => {
    stringStyleHtml('abc', 'i', 'style="pointer-events:none"').should.equal(
      '<i style="pointer-events:none">abc</i>');
  });

});
