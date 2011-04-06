(function() {

    var centerLatLng = new google.maps.LatLng(-24.1,133.5),
        element = document.getElementById("raphmap"),
        gMap = new google.maps.Map(element, {
          zoom: 3,
          center: centerLatLng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }),
        raphmap = new RaphMap(element, gMap),
        point = new SimplePoint(new google.maps.LatLng(-24.1,133.5));
    
    raphmap.addElement(point);

    function getDefaultUI(gMap) {
        var customUI = {controls: {},zoom:{}};//gMap.getDefaultUI();
        customUI.controls.scalecontrol = false;
        customUI.controls.largemapcontrol3d  = false;
        customUI.controls.maptypecontrol = false;
        customUI.controls.menumaptypecontrol = true;
        customUI.controls.smallzoomcontrol3d = true;
        customUI.zoom.scrollwheel = true;

        return customUI;
    }
})();
