/*! 
 * RaphMap 0.1 - Google Maps Vector Overlay - Based Raphael JavaScript Vector Library
 * by Dmitry Baranovskiy (http://raphaeljs.com/)
 *
 * Copyright (c) 2010 Dave Elkan (http://edave.net)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

RaphMap = (function() {

    var

    proto = "prototype",
    _limit = 50,
    
    RM = function(container, map) {
        this.container = container;
        this.dragging = false;
        this.draggable = true;
        this.setMap(map);
        this.xOffset = 0;
        this.yOffset = 0;
        this.drawn = false;
        this.renderBuffer = [];
        this.elements = [];
    };
    
    RM[proto] = new google.maps.OverlayView();

    RM[proto].onAdd = function() {
        this.element = this.createWrapperElement();
        this.paper = Raphael(
            this.element,
            this.getWidth(),
            this.getHeight()
        );
        this.map.controls[google.maps.ControlPosition.TOP].push(this.element);
        this.shapes = this.paper.set();
        this.initOverlayDrag();
        this.projection = this.getProjection();
    };

    RM[proto].draw = function() {
        if (!this.drawn) {
            this.drawn = true;
            for (var i = 0, ii = this.renderBuffer.length; i < ii; i++) {
                this.addElement(this.renderBuffer[i]);
            }
            this.renderBuffer = [];
        }
    };
    
    RM[proto].onRemove = function() {
        console.log("onRemove", arguments);
    };

    function _zoomIn(event) {
        this.map.zoomIn(_getLatLngFromEvent(event), true);
    }

    function _getLatLngFromEvent(event) {
        return this.map.fromDivPixelToLatLng(new google.maps.Point(event.layerX - this.xOffset, event.layerY - this.yOffset));
    }

    RM[proto].getCoordsForLatLong = function(latlong) {
        if (latlong) {
            var coords = this.projection.fromLatLngToDivPixel(latlong);
            return this.getCoordsWithOffset(coords);
        }
    }

    RM[proto].getCoordsWithOffset = function(coords) {
        coords.x += this.xOffset;
        coords.y += this.yOffset;
        return coords;
    }

    RM[proto].hideAndShowOutOfBounds = function() {
        for (var i = 0, j = this.shapes.length; i < j; i++) {
            var outside = false;
            if (_isOutside(this.shapes[i])) {
                outside = true;
                this.elements[i].redraw(this.getCoordsForLatLong(this.elements[i].getLatLong()));
            }
            this.elements[i].isOutside(outside);
        }
    }

    function _isOutside(shape) {
        shape = (shape.items) ? shape[0] : shape;
        var x = shape.attr('cx'),
            y = shape.attr('cy');
        return ((x < 0 || x > this.containerWidth) || (y < 0 || y > this.containerHeight));
    }
    
    RM[proto].simulateClick = function(parent) {

    }
    
    RM[proto].dragOverlayMouseDown = function(e) {
        if (this.draggable) {
            this.xPos = e.layerX;
            this.yPos = e.layerY;
            this.dragging = true;
        }
    }

    RM[proto].createWrapperElement = function() {
        var
        self = this,
        div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = 0;
        div.style.top = 0;
        div.onmousedown = function(e) {
            self.dragOverlayMouseDown(e);
        }
/*        if (this.map.doubleClickZoomEnabled()) {
            div.ondblclick = _zoomIn;
        }*/

        return div;
    };
    
    RM[proto].initOverlayDrag = function() {
        var self = this;
        document.onmousemove = function(e) {
            e = e || window.event;
            if (self.dragging) {
                self.drag(e);
            }
        }

        document.onmouseup = function() {
            self.dragging = false
        }
    };
    
    RM[proto].drag = function(e) {

        var
        _moveX = (this.xPos - e.layerX),
        _moveY = (this.yPos - e.layerY),
        currentCenter = this.map.getCenter(),
        // Get center as pixels
        centerPoint = this.projection.fromLatLngToDivPixel(currentCenter);
        // Add move onto center pixels
        centerPoint.x += _moveX;
        centerPoint.y += _moveY;
        // tranlate center pixels to latlng
        var newCenter = this.projection.fromDivPixelToLatLng(centerPoint);
        this.map.setCenter(newCenter);
    
      //  gMapDragger.moveBy(gMapSize);
        this.xPos = e.layerX;
        this.yPos = e.layerY;
        this.xOffset += _moveX;
        this.yOffset += _moveY;
        this.shapes.translate(_moveX * -1, _moveY * -1);
        //_hideAndShowOutOfBounds();
    }

    RM[proto].addElement = function(element) {
        if (!this.drawn) {
            this.renderBuffer.push(element);
        } else {
            var coords = this.getCoordsForLatLong(element.getLatLong());
                shape = element.draw(this.paper, coords);
            if (this.shapes.length >= _limit) {
                this.shapes.shift().remove();
                this.elements.shift();
            }
            this.shapes.push(shape);
            this.elements.push(element);
        }
    };

    RM[proto].removeOverlay = function() {
        _wrapper.parentNode.removeChild(_wrapper)
    };

    RM[proto].copyOverlay = function() {
        return new RaphMap(this.container);
    }

    RM[proto].redraw = function(force) {
        if (!force) return;
        for (var i = 0, j = this.shapes.length; i < j; i++) {
            var coords = this.getCoordsForLatLong(this.elements[i].getLatLong());
            this.elements[i].redraw(coords);
        }
    }

    RM[proto].zoomTo = function(latLong) {
        this.map.setCenter(latLong, 12)
    }

    RM[proto].isDragging = function() {
        return this.dragging;
    }

    RM[proto].getWidth = function() {
        return this.container.offsetWidth;
    }

    RM[proto].getHeight = function() {
        return this.container.offsetHeight;
    }
    
    RM[proto].setDraggable = function(draggable) {
        this.draggable = draggable;
    }
    
    function copyRaphaelElementPrototype() {
        var raphMapElementPrototype = {};
        for (var p in Raphael.el) {
            raphMapElementPrototype[p] = Raphael.el[p];
        }
        return raphMapElementPrototype;
    }

    var Element = function() {};
    Element[proto].getLatLong = function() {
        return this.latLong;
    };
    Element[proto].draw = function() {
        throw ("You must implement the RaphMaps.Element#draw function");
    };
    Element[proto].redraw = function(coords) {
        this.points.attr({
            cx: coords.x,
            cy: coords.y
        });
    };
    Element[proto].isOutside = function(isOutside) {
        if ((isOutside && !this.elementIsOutside) || (!isOutside && this.elementIsOutside)) {
            this.elementIsOutside = isOutside;
            var outsideEvent = "element" + ((isOutside) ? "Out" : "In") + "side";
            //this.trigger(outsideEvent, this.tweet.id);
        }
    };
    Element[proto].toString = function() {
        return "Raphmap.Element " + this.latLong;
    };
    RM.Element = Element;

    return RM;
})();
