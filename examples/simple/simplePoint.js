SimplePoint = (function() {
    var 
    
    settings = {
        inner: {
            "r": 0.5,
            "stroke": "#000",
            "fill": "#F00"
        },
        outer: {
            "r": 5,
            "stroke": "#2277BB",
            "stroke-width": 1,
            "fill": "#000",
            "fill-opacity": 0.3
        }
    },
    
    _element = function(latLong) {
        this.latLong = latLong;
    },
    
    prototype = "prototype";

    _element[prototype] = new RaphMap.Element();
    
    _element[prototype].draw = function(paper, coords) {
        if (paper && coords) {
            this.points = paper.set();
            this.inner = paper.circle(coords.x, coords.y);
            this.inner.attr(settings.inner);
            this.outer = paper.circle(coords.x, coords.y);
            this.outer.attr(settings.outer);
            this.points.push(
                this.inner,
                this.outer
            );

            return this.points;
        }
    };
    
    _element[prototype].isOutside = function(isOutside) {
        if ((isOutside && !this.elementIsOutside) || (!isOutside && this.elementIsOutside)) {
            this.elementIsOutside = isOutside;
            var outsideEvent = "element" + ((isOutside) ? "Out" : "In");
        }
    };
    
    _element[prototype].toString = function() {
        return "SamplePoint" + this.latLong;
    };

    return _element; 
})();