G_MAP_MAP_PANE = document.getElementById("map_pane");
GMap2 = (function() {
    var map = function() {};
    map.prototype = function(){};
    map.prototype.getPane = function(pane) {
        return G_MAP_MAP_PANE;
    };
    map.prototype.doubleClickZoomEnabled = function() {
        return true;
    };
    map.prototype.getDragObject = function() {
        return {};
    };
    map.prototype.toString = function() {
        return "Mock Gmap";
    };
    
    return map;
})();

GLatLng = function() {

};

GEvent = (function() {
    var event = function() {};
    event.prototype = function() {};
    event.prototype.addListener = function() {
    
    };
    
    return new event;
})();

GSize = (function() {
    var size = function() {};
    size.prototype = function() {};
    
    return size;
})();
