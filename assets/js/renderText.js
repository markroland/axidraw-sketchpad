/**
 * Render a string of text in a Hershey engraving font to a given SVG element
 *
 * This is derivative work of https://github.com/techninja/hersheytextjs/blob/master/hersheyexample.html
 *
 * @param {string} s
 *   Text string to be rendered
 * @param {object} options
 *   Object of named options:
 *    font {obj}: [Required] Font object containing path elements for font
 *    charWidth {int}: [Optional] Base width given to each character
 *    charHeight {int}: [Optional] Base height given to each character (when wrapping)
 *    wrapWidth {int}: [Optional] Max line size at which to wrap to the next line
 *
 * @returns {string}
 *   String of SVG <path> tags
 */
function renderText(s, options) {

  let svg_string = '';

  try {
    const font = options.font.chars;
    options.charWidth = options.charWidth ? options.charWidth : 10;
    options.charHeight = options.charHeight ? options.charHeight : 28;
    options.lineHeight = options.lineHeight ? options.lineHeight : 28;

    const offset = { left: 0, top: 0 };

    // Move through each line
    const lines = s.split("\n");
    for(let l in lines) {

      // Move through each word
      const words = lines[l].split(' ');
      for(let w in words) {

        const word = words[w];

        // Use charWidth as a rough approximation to see if the word
        // can fit on the line.
        // let charOffset = options.charWidth;
        // let word_width = word.length * charOffset
        let word_width = 0;
        for(let i in word) {
          let ascii_code = word.charCodeAt(i)
          const index = ascii_code - 33;
          word_width += font[index].o
        }

        // Wrap line if word goes over width
        if (options.wrapWidth) {
          if (offset.left + word_width > options.wrapWidth) {
            offset.left = 0;
            offset.top += options.charHeight * options.lineHeight
          }
        }

        // Move through each letter
        for(let i in word) {

          // Font library character position
          let ascii_code = word.charCodeAt(i)
          const index = ascii_code - 33;

          if (font[index]){

            // charOffset = font[index].o;

            svg_string += '<path d="' + font[index].d + '"'
              + ' fill="none"'
              + ' stroke="rgb(0,0,0)"'
              + ' paint-order="fill stroke markers"'
              + ' stroke-opacity="1"'
              + ' stroke-linecap="round"'
              + ' stroke-miterlimit="10" '
              + ' stroke-width="2.5" '
              + ' style="stroke:rgb(0,0,0); fill:none;" '
              + ' transform="translate(' + offset.left + ', ' + offset.top + ')" />'
              + "\n";
          }

          // Add space between letters
          // offset.left += charOffset + options.charWidth;
          // This "0.7" Factor is from Line 108 of https://gist.github.com/markroland/228352a6fdec1ab4190339b6e10d36be
          // and is probably an error
          offset.left += (1/0.7) * font[index].o;
        }

        // Add space between words
        offset.left += (1/0.7) * (font[62].o/2) // This is the half-width of the Underscore "_" characters width
        // offset.left += options.charWidth * 2;
      }

      // Adjust position to beginning of next line
      offset.left = 0;
      offset.top += options.charHeight * options.lineHeight
    }
  } catch(e) {
    console.error(e);
    return false;
  }

  return svg_string;
}
