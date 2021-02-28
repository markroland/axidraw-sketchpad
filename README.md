# AxiDraw Drawing Canvas

![Program Screenshot](assets/data/Program-Screenshot.png)

## Usage

This is an active, personal code sketchbook and as such isn't optimized
for others to start using easily, but I do hope people can find some
value with it now or in the future when I've had a chance
to make it more user friendly.

The `js/axidraw.js` file is the entry point to the p5.js sketch. Near
the top of the file is an object called `Patterns` that has key-value
pairs for each of the drawing algorithms I've written. Below that,
`selectedPattern` has the value of the currently active pattern. This
value should be changed to one of the values from the `Patterns` object
in order to explore other work.

Beyond that, artwork is coded in the classes housed in the `js/patterns`
folder. The `draw` method of these classes is called by `axidraw.js`, so
that is your entry point for exploring the algorithm of the drawing.

[View Now](https://markroland.github.io/axidraw-sketchpad/index.html)

## Dimensions / Format

![Dimension Guide](assets/data/Dimension-Guide.png)

This project exports drawings to a 6" x 4" SVG file at 96 dpi
suitable to printing on an [AxiDraw MiniKit 2](https://shop.evilmadscientist.com/productsmenu/924).

For the most part, drawings are confined to 5" x 3". This provides margin for adding a title, date
and signature, and the 5:3 proportion works well for even division.

Even though this is based on p5.js, the coordinates for constructing paths is based
around a [0,0] origin point at the center of the canvas. The base unit (1) extends
to the minimum constraint of the drawing canvas, the height. With this layout, the
distance from the origin [0,0] to the top-center of canvas is 1.5 inches.

## Use of P5.js

This uses the [p5.js-svg library](https://github.com/zenozeng/p5.js-svg) to run P5.js in SVG mode.
It uses the [svgcanvas project](https://github.com/zenozeng/svgcanvas), which appears to
require using P5.js in [instance mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode)
in order to specify where to insert the HTML `<canvas>` element.

- [p5.SVG Basic Examples](http://zenozeng.github.io/p5.js-svg/examples/#basic)

## Run from server

Because this code loads external resources (image and font files), modern browsers will require
it to be run from a local HTTP server, as opposed to running from the file system (i.e. File://).

There are [many great ways to start a local HTTP server](https://gist.github.com/willurd/5720255),
but here is a command for Python 3.

```
python -m http.server
```

## License

At this point I am not formally licensing this code. It's my intent for others to learn from 
and use this code (otherwise I wouldn't share it publicly), but all art generated using this
code as committed into this repository belongs to Mark Roland.
