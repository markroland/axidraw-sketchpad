/**
 * Render a string of text in a Hershey engraving font to a given SVG element
 *
 * @param {string} s
 *   Text string to be rendered
 * @param {object} options
 *   Object of named options:
 *    font {obj}: [Required] Font object containing path elements for font
 *    id {string}: [Required] ID to give the final g(roup) SVG DOM object
 *    pos {object}: [Required] {X, Y} object of where to place the final object within the SVG
 *    charWidth {int}: [Optional] Base width given to each character
 *    charHeight {int}: [Optional] Base height given to each character (when wrapping)
 *    scale {int}: [Optional] Scale to multiply size of everything by
 *    wrapWidth {int}: [Optional] Max line size at which to wrap to the next line
 *    centerWidth {int}: [Optional] Width to center multiline text inside of
 *    centerHeight {int}: [Optional] Height to center text inside of vertically
 *
 * @returns {boolean}
 *   Operates directly on the given target given in options, returns false if
 *   required option missing or other failure.
 */
function renderText(s, options) {

  let svg_string = '';

  try {
    const font = options.font.chars;
    options.charWidth = options.charWidth ? options.charWidth : 10;
    options.charHeight = options.charHeight ? options.charHeight : 28;

    const offset = { left: 0, top: 0 };
    options.scale = options.scale ? options.scale : 1;

    // Initial Line container
    let lineCount = 0;

    // Move through each word
    const words = s.split(' ');
    for(let w in words) {
      const word = words[w];

      // Move through each letter
      for(let i in word) {
        const index = word.charCodeAt(i) - 33;

        // Only print in range chars
        let charOffset = options.charWidth;
        if (font[index]){
          charOffset = font[index].o;

          svg_string += '<path d="' + font[index].d + '" fill="none" stroke="rgb(0,0,0)" paint-order="fill stroke markers" stroke-opacity="1" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2.5" style="stroke:rgb(0,0,0); fill:none;" transform="translate(' + offset.left + ', ' + offset.top + ')" />' + "\n";
        }

        // Add space between letters
        offset.left+= charOffset + options.charWidth;
      }

      // Add space between words
      offset.left += options.charWidth/2;
    }
  } catch(e) {
    console.error(e);
    return false; // Error!
  }

  return svg_string;
}
