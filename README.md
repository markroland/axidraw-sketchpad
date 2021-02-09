# AxiDraw Drawing Canvas

[Use Now](https://markroland.github.io/axidraw-sketchpad/index.html)

This project exports drawings to a 6" x 4" SVG file at 96 dpi
suitable to printing on an [AxiDraw MiniKit 2](https://shop.evilmadscientist.com/productsmenu/924).

This uses the [p5.js-svg library](https://github.com/zenozeng/p5.js-svg) to run P5.js in SVG mode.
It uses the [svgcanvas project](https://github.com/zenozeng/svgcanvas), which appears to
require using P5.js in [instance mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode)
in order to specify where to insert the HTML `<canvas>` element.

- [p5.SVG Basic Examples](http://zenozeng.github.io/p5.js-svg/examples/#basic)

## Run from server

```
python3 -m http.server
```