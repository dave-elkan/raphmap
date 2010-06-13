(function() {
    var
    element = document.getElementById("raphmap"),
    raphmap = new RaphMap(element),
    gMap = new GMap2(element);
    console.log(gMap);
    raphmap.initialize(gMap);
})();
