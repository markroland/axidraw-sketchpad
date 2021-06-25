/*
 * Concave Hull
 *
 * The purpose of this library is to calculate a Concave Hull from a set of points in 2D space
 *
 * References
 *  - https://towardsdatascience.com/the-concave-hull-c649795c0f0f
 *   - http://repositorium.sdum.uminho.pt/bitstream/1822/6429/1/ConcaveHull_ACM_MYS.pdf
 *
 */

var concaveHull = function() {

    function hello(){
        console.log('Hello from concaveHull')
    }

    // Return public points to the private methods and properties you want to reveal
    return {
        hello: hello
    }
}();