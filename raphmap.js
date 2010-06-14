/*! 
 * RaphMap 0.1 - Google Maps Vector Overlay - Based Raphael JavaScript Vector Library
 * by Dmitry Baranovskiy (http://raphaeljs.com/)
 *
 * Copyright (c) 2010 Dave Elkan (http://edave.net)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

RaphMap = (function() {

    var

    _gMap,
    _wrapper,
    _paper,
    _elements = [],
    _shapes,
    _xOffset,
    _yOffset,
    _container,
    _containerWidth,
    _containerHeight,
    proto = "prototype",
    _limit = 50,
    
    RM = function(container) {
        _container = container;
        _containerWidth = _container.offsetWidth;
        _containerHeight = _container.offsetHeight;
        this.dragging = false;
        this.draggable = true;
    };
    RM[proto] = new google.maps.OverlayView();

    function _zoomIn(event) {
        _gMap.zoomIn(_getLatLngFromEvent(event), true);
    }

    function _getLatLngFromEvent(event) {
        return _gMap.fromDivPixelToLatLng(new google.maps.Point(event.layerX - _xOffset, event.layerY - _yOffset));
    }

    function _getCoordsForLatLong(latlong) {
        if (latlong) {
/*            var coords = _gMap.fromLatLngToDivPixel(latlong);
            return _getCoordsWithOffset(coords);*/
        }
    }

    function _getCoordsWithOffset(coords) {
        coords.x += _xOffset;
        coords.y += _yOffset;
        return coords;
    }

    function _hideAndShowOutOfBounds() {
        for (var i = 0, j = _shapes.length; i < j; i++) {
            var outside = false;
            if (_isOutside(_shapes[i])) {
                outside = true;
                _elements[i].redraw(_getCoordsForLatLong(_elements[i].getLatLong()));
            }
            _elements[i].isOutside(outside);
        }
    }

    function _isOutside(shape) {
        shape = (shape.items) ? shape[0] : shape;
        var x = shape.attr('cx'),
            y = shape.attr('cy');
        return ((x < 0 || x > _containerWidth) || (y < 0 || y > _containerHeight));
    }

    RM[proto].initialise = function(gMap) {
        _gMap = gMap
        var 
        _element = this.createWrapperElement(),
        _paper = Raphael(
            _element,
            _containerWidth,
            _containerHeight
        );
        gMap.controls[google.maps.ControlPosition.TOP].push(_element);
        this.setMap(gMap);
        _shapes = _paper.set();
        _xOffset = 0;
        _yOffset = 0;
        
        google.maps.event.addListener(gMap, 'click', function(mEvent) {
          console.log('clicked');
        });
        
        window.onmousemove = function(e) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", false, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, false, false, false, false, e.button, null);
            _element.dispatchEvent(evt);
        };
        //GEvent.addListener(_gMap, "zoomend", _hideAndShowOutOfBounds);
        this.initOverlayDrag();
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
/*        if (_gMap.doubleClickZoomEnabled()) {
            div.ondblclick = _zoomIn;
        }*/

        return div;
    };
    
    RM[proto].initOverlayDrag = function() {
        var self = this;
        console.log(this)
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
        projection = this.getProjection(),
        currentCenter = _gMap.getCenter(),
        // Get center as pixels
        centerPoint = projection.fromLatLngToDivPixel(currentCenter);
        // Add move onto center pixels
        centerPoint.x += _moveX;
        centerPoint.y += _moveY;
        // tranlate center pixels to latlng
        var newCenter = projection.fromDivPixelToLatLng(centerPoint);
        _gMap.setCenter(newCenter);
    
      //  gMapDragger.moveBy(gMapSize);
        this.xPos = e.layerX;
        this.yPos = e.layerY;
        _xOffset += _moveX;
        _yOffset += _moveY;
    /*    _shapes.translate(_moveX, _moveY);
        _hideAndShowOutOfBounds();*/
    }

    RM[proto].draw = function() {
    };

    RM[proto].addElement = function(element) {
        var coords = _getCoordsForLatLong(element.getLatLong()),
            shape = element.draw(_paper, coords);
        if (_shapes.length >= _limit) {
            _shapes.shift().remove();
            _elements.shift();
        }
        _shapes.push(shape);
        _elements.push(element);
    };

    RM[proto].removeOverlay = function() {
        _wrapper.parentNode.removeChild(_wrapper)
    };

    RM[proto].copyOverlay = function() {
        return new RaphMap(_container);
    }

    RM[proto].redraw = function(force) {
        if (!force) return;
        for (var i = 0, j = _shapes.length; i < j; i++) {
            var coords = _getCoordsForLatLong(_elements[i].getLatLong());
            _elements[i].redraw(coords);
        }
    }

    RM[proto].zoomTo = function(latLong) {
        _gMap.setCenter(latLong, 12)
    }

    RM[proto].isDragging = function() {
        return this.dragging;
    }

    RM[proto].width = function() {
        return _containerWidth;
    }

    RM[proto].height = function() {
        return _containerHeight;
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
