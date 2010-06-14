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
    _dragging = false,
    _xPos,
    _yPos,
    _xOffset,
    _yOffset,
    _container,
    _containerWidth,
    _containerHeight,
    _draggable = true,
    proto = "prototype",
    _limit = 50,
    
    RM = function(container) {
        _container = container;
        _containerWidth = _container.offsetWidth;
        _containerHeight = _container.offsetHeight;
    };
    RM[proto] = new GOverlay;

    function _createWrapperElement() {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.left = 0;
        div.style.top = 0;
        div.onmousedown = _dragOverlayMouseDown;
        if (_gMap.doubleClickZoomEnabled()) {
            div.ondblclick = _zoomIn;
        }

        return div;
    }
    
    function _dragOverlayMouseDown(e) {
        if (_draggable) {
            _xPos = e.layerX;
            _yPos = e.layerY;
            _dragging = true;
        }
    }

    function _initOverlayDrag() {
        document.onmousemove = function(e) {
            e = e || window.event;
            if (_dragging) {
                _dragOverlay(e);
            }
        }

        document.onmouseup = function() {
            _dragging = false
        }
    }

    function _zoomIn(event) {
        _gMap.zoomIn(_getLatLngFromEvent(event), true);
    }

    function _getLatLngFromEvent(event) {
        return _gMap.fromDivPixelToLatLng(new GPoint(event.layerX - _xOffset, event.layerY - _yOffset));
    }

    function _dragOverlay(e) {
        var
        _moveX = -1 * (_xPos - e.layerX),
        _moveY = -1 * (_yPos - e.layerY),
        gMapDragger = _gMap.getDragObject(),
        gMapSize = new GSize(_moveX, _moveY);
    
        gMapDragger.moveBy(gMapSize);
        _xPos = e.layerX;
        _yPos = e.layerY;
        _xOffset += _moveX;
        _yOffset += _moveY;
        _shapes.translate(_moveX, _moveY);
        _hideAndShowOutOfBounds();
    }

    function _getCoordsForLatLong(latlong) {
        if (latlong) {
            var coords = _gMap.fromLatLngToDivPixel(latlong);
            return _getCoordsWithOffset(coords);
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

    RM[proto].initialize = function(gMap) {
        _gMap = gMap;
        var pane = _gMap.getPane(G_MAP_MAP_PANE).parentNode.parentNode;
        _wrapper = _createWrapperElement();
        pane.appendChild(_wrapper);
        _paper = Raphael(
            _wrapper,
            _containerWidth,
            _containerHeight
        );
        _shapes = _paper.set();
        _xOffset = 0;
        _yOffset = 0;
    
        GEvent.addListener(_gMap, "zoomend", _hideAndShowOutOfBounds);

        _initOverlayDrag();
    }

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
        return _dragging;
    }

    RM[proto].width = function() {
        return _containerWidth;
    }

    RM[proto].height = function() {
        return _containerHeight;
    }
    
    RM[proto].setDraggable = function(draggable) {
        _draggable = draggable;
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
