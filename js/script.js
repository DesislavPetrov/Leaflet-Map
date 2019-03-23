var map;
var layerOSM;
var markerCurrentLocation;
var ll;
var popStadium;
var controlZoom;
var controlAttribute;
var controlScale;
var controlPan;
var controlZoomSlider;
var controlMousePosition;
var controlPolylineMeasure;

map = L.map('map', {center:[ 42.337140, 23.553115], zoom: 12, zoomControl: false, attributionControl: false});

layerOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

map.addLayer(layerOSM);

// controlZoom = L.control.zoom({zoomInText: "In", zoomOutText: "Out", position: "topright"});
// controlZoom.addTo(map);

controlPan = L.control.pan();
controlPan.addTo(map);

controlZoomSlider = L.control.zoomslider({position: "topright"});
controlZoomSlider.addTo(map);

controlAttribute = L.control.attribution({position: "bottomleft"});
controlAttribute.addAttribution("<a href='http://geocadder.bg/en'>geocadder</a>");
controlAttribute.addTo(map);

controlScale = L.control.scale({position:  "bottomleft", imperial: false});
controlScale.addTo(map);

controlMousePosition = L.control.mousePosition();
controlMousePosition.addTo(map);

controlPolylineMeasure = L.control.polylineMeasure();
controlPolylineMeasure.addTo(map);

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

$("#btnLocate").click(function(){
    map.locate();
})

$("#btnStadium").click(function(){
    map.setView([42.684146, 23.339908], 17);
    map.openPopup(popStadium);
})

function LatLngToArrayString(ll){
    return "[" + ll.lat.toFixed(5) + ", "  + ll.lng.toFixed(5) + "]";
}

