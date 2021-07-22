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

## Patterns

The Patterns folder contains classes used for composing sketches. Classes contain helper functions.
The actual sketch can be selected from the `draw` method of the class.

 - 3D
   - Simple Cube
   - Anaglyph Cube
   - Spiral Sphere
   - Perlin Noise Plane
   - GeoJSON Elevation Plane
   - GeoJSON Grand Prix Track Map
   - Spike Ball
   - Lorenz Attractor
 - Bezier
   - Basic Bezier Curve
   - Bezier Curve with Offset
   - Bezier Curve offset with capped ends
   - Bezier Curve with capped ends and tapered offset
 - CassiniOval
 - Cycloid
 - Extrusion
 - Fibonacci Spiral Phyllotaxis
 - FlowField
 - Genuary 2021](https://genuary2021.github.io/prompts)
   - Farris Curves
   - Crosshatch study
   - Circle Packing
   - Touching Circles on the perimeter of a Circle
 - GeoJSON
 - Gravity
 - Grid
   - 10 Print
   - Sashiko Stitching
   - Fish Scales
 - Heart
 - Ioslines
 - Lindenmayer System
   - Hilbert Curve
   - Gosper Curve
   - Sierpinski Arrowhead
 - LineImage
   - Bitmap image to horizontal lines
   - Bitmap image -> posterization -> marching squares contours
   - Bitmap image to 4-direction cross hatching
   - Bitmap image to 4-direction cross hatching (CMYK color)
   - Bitmap image to pixel spirals
   - Bitmap image to pixel double (fermat) spirals
   - Bitmap image to "weave" spirals
   - Bitmap image to dithered pixels
   - Bitmap image to edge detection with Sobel Filter
   - Bitmap image to edge detection with Canny Edge Detection
   - Bitmap image to Convex Hull tracing
 - Lissajous
 - NegativeSpace
 - Postcard
 - RadialLines
 - Radiography
 - ShapeMorph
 - Sketchbook
   - [Toxiclib](https://github.com/hapticdata/toxiclibsjs) Test
   - Recursive Tree
   - Pen Resolution Test
   - Concave Hull Test
   - Hyperbolic Spiral Study
   - Crop Paths to Circle
 - Spirals
   - Arithmetic (Archimedean)
   - Fermat (Double)
   - Hyperbolic
 - Superellipse
 - Truchet
   - Basic Truchet Tiling
   - Parallel Line Truchet Tiling
   - Grid Petals
 - WolframRules (Rule 30)
   - Pyramidal
   - Circular

## PathHelper

The PathHelper class contains a variety of methods to assist with performing operations
on multi-point paths (polylines).

 - info
 - getMin
 - getMax
 - boundingBox
 - arrayMin
 - arrayMax
 - getRndInteger
 - getRandom
 - map
 - lerp
 - polygon
 - intersect_point
 - getLineLineCollision
 - distance
 - perpendicularPath
 - parallelPath
 - expandPath
 - arcPointToPoint
 - arc
 - lineSlopeIntercept
 - arrayColumn
 - centerPaths
 - scapePath
 - translatePath
 - rotatePath
 - shiftPath
 - subdividePath
 - dividePath
 - joinPaths
 - pointsToPaths2
 - pointsToPaths
 - smoothPath
 - quadraticBezierPath
 - quadraticBezierPathAlgorithm
 - cubicBezierPath
 - sortPaths
 - polarToRect
 - pointOnLineSegment
 - lineCircleIntersect
 - solveQuadratic
 - circleInterceptPoints
 - cropToCircle

## License

At this point I am not formally licensing this code. It's my intent for others to learn from 
and use this code (otherwise I wouldn't share it publicly), but all art generated using this
code as committed into this repository belongs to Mark Roland.
