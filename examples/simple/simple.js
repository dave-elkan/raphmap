(function() {
    var
    
    element = document.getElementById("raphmap"),
    raphmap = new RaphMap(element),
    gMap = new GMap2(element);

    gMap.setCenter(new GLatLng(-28, 135), 3);
    gMap.setUI(getDefaultUI(gMap));
    gMap.addOverlay(raphmap);
    
    var point = new SimplePoint(new GLatLng(-34, 151));
    
    raphmap.addElement(point);

    function getDefaultUI(gMap) {
        var customUI = gMap.getDefaultUI();
        customUI.controls.scalecontrol = false;
        customUI.controls.largemapcontrol3d  = false;
        customUI.controls.maptypecontrol = false;
        customUI.controls.menumaptypecontrol = true;
        customUI.controls.smallzoomcontrol3d = true;
        customUI.zoom.scrollwheel = true;

        return customUI;
    }
})();
