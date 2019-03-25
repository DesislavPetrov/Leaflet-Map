var map;
var layerOSM;
var layerWatercolor;
var layerTopo;
var layerImagery;
var layerOutdoors;
var markerCurrentLocation;
var markerMallBulgaria;
var mallToStadiumPath;
var ll;
var popStadium;
var controlZoom;
var controlAttribute;
var controlScale;
var controlPan;
var controlZoomSlider;
var controlMousePosition;
var controlPolylineMeasure;
var controlEasyButton;
var controlEasyButtonSidebar;
var controlSidebar;
var controlOpencageSearch;
var controlLayer;
var baseLayers;
var overlayLayers;
var imageOverlayLayer;

map = L.map('map', {center:[42.663941, 23.288768], zoom: 12, zoomControl: false, attributionControl: false});

// layerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
layerOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
layerWatercolor = L.tileLayer.provider('Stamen.Watercolor');
layerTopo = L.tileLayer.provider('OpenTopoMap');
layerImagery = L.tileLayer.provider('Esri.WorldImagery');
layerHydra = L.tileLayer.provider('Hydda.Full');



map.addLayer(layerOSM, imageOverlayLayer);

baseLayers = {
    "Open Street Maps": layerOSM,
    "Watercolor": layerWatercolor,
    "Topo Map": layerTopo,
    "Imagery": layerImagery,
    "Hydra": layerHydra
};

var imageUrl = '/img/1.PNG',
    imageBounds = [[42.41883, 23.68115], [42.31081, 23.60302]];
imageOverlayLayer = L.imageOverlay(imageUrl, imageBounds);

overlayLayers = {
    "Image Overlay": imageOverlayLayer
};

controlLayer = L.control.layers(baseLayers,  overlayLayers).addTo(map);

// controlZoom = L.control.zoom({zoomInText: "In", zoomOutText: "Out", position: "topright"});
// controlZoom.addTo(map);

controlPan = L.control.pan();
controlPan.addTo(map);

controlZoomSlider = L.control.zoomslider({position: "topright"});
controlZoomSlider.addTo(map);

controlEasyButton = L.easyButton ("glyphicon-screenshot", function(){
    map.locate();
}).addTo(map);

controlAttribute = L.control.attribution({position: "bottomleft"});
controlAttribute.addAttribution("<a href='http://geocadder.bg/en'>geocadder</a>");
controlAttribute.addTo(map);

controlScale = L.control.scale({position:  "bottomleft", imperial: false});
controlScale.addTo(map);

controlMousePosition = L.control.mousePosition();
controlMousePosition.addTo(map);

controlPolylineMeasure = L.control.polylineMeasure();
controlPolylineMeasure.addTo(map);

controlSidebar = L.control.sidebar('sidebar', {
    position: 'left'
});
controlSidebar.addTo(map);

controlEasyButtonSidebar = L.easyButton('glyphicon-transfer', function(){
    controlSidebar.toggle();
}).addTo(map);

controlOpencageSearch = L.Control.openCageSearch({key: '1ecacf64368d4930bd6e4e6ceadba65c', limit: 10}).addTo(map);

// map.on('click', function(e){
//     if(e.originalEvent.shiftKey){
//         alert(map.getZoom());
//     } else {
//         alert(e.latlng.toString());
//     }
// })


popStadium = L.popup({keepInView: true})
    .setLatLng([42.684146, 23.339908])
    .setContent("<h2>Bulgarian Army Stadium</h2> <img src='https://www.dnevnik.bg/shimg/zx860y484_3150587.jpg' width='300px'>");;


markerMallBulgaria = L.marker([42.663941, 23.288768], {draggable: true}).addTo(map);
markerMallBulgaria.bindTooltip("Mall Bulgaria");
  
mallToStadiumPath = L.polyline([[42.663941, 23.288768], [42.665156, 23.287756], [42.678493, 23.299017], [42.686415, 23.331007], [42.681853, 23.336322], [42.684121, 23.339645]]).addTo(map);

map.on('contextmenu', function(e){
    L.marker(e.latlng).addTo(map).bindPopup(e.latlng.toString());
})

// map.on('contextmenu', function(e){
//     console.log(e);
// })

map.on('keypress',function(e){
    if(e.originalEvent.key == "l"){
        map.locate();
    }
})

map.on('locationfound', function(e){
    console.log(e);
    if(markerCurrentLocation){
        markerCurrentLocation.remove();
    }    
    markerCurrentLocation = L.circle(e.latlng, {radius:e.accuracy/2}).addTo(map);
    map.setView(e.latlng, 18);
})

map.on('locationerror', function(e){
    console.log(e);
    alert("Location  was not found");
})

map.on('zoomend', function(){
    $("#zoom-level").html(map.getZoom());
})

map.on('moveend', function(){
    $("#map-center").html(LatLngToArrayString(map.getCenter()));    
})

map.on('mousemove', function(e){
    $("#mouse-location").html(LatLngToArrayString(e.latlng));
})

markerMallBulgaria.on('dragend', function(){
    markerMallBulgaria.setTooltipContent("Current Location: " + markerMallBulgaria.getLatLng().toString() + "<br> Distance to Mall Bulgaria: " + markerMallBulgaria.getLatLng().distanceTo([42.663941, 23.288768]).toFixed(0) + " m");
})

// markerMallBulgaria.on('dragend', function(){
//     this.setTooltipContent("Current Location: " + this.getLatLng());
// })

$("#btnLocate").click(function(){
    map.locate();
})

$("#btnStadium").click(function(){
    map.setView([42.684146, 23.339908], 17);
    map.openPopup(popStadium);
})

$("#btnMall").click(function(){
    map.setView([42.663941, 23.288768], 17);
    markerMallBulgaria.setLatLng([42.663941, 23.288768]);
    markerMallBulgaria.setTooltipContent("Mall Bulgaria");
})

$("#slideOpacity").on("change", function(){
    $("#image-opacity").html(this.value);
    imageOverlayLayer.setOpacity(this.value);
});

function LatLngToArrayString(ll){
    return "[" + ll.lat.toFixed(5) + ", "  + ll.lng.toFixed(5) + "]";
}

