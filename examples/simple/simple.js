(function() {
    var
    
    element = document.getElementById("raphmap"),
    raphmap = new RaphMap(element)/*,
    gMap = new google.maps.Map(element)*/;

    var centerLatLng = new google.maps.LatLng(37.748582,-122.418411);
    var gMap = new google.maps.Map(document.getElementById('raphmap'), {
      'zoom': 3,
      'center': centerLatLng,
      'mapTypeId': google.maps.MapTypeId.ROADMAP
    });


    gMap.setCenter(new google.maps.LatLng(-28, 135), 3);
    raphmap.initialise(gMap);
    
    var point = new SimplePoint(new google.maps.LatLng(-34, 151));
    
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
