/*
 * Copyright 2016 Joe Bowser
 *
 */


//Setup the map
mapboxgl.accessToken = 'pk.eyJ1IjoiaW5maWwwMHAiLCJhIjoiYlJKRXF0OCJ9.9ljxQbyejVO1GxY94oj1LA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/infil00p/cikozh0cn00kubgm1x3nz0y66',
  center : [-96, 55],
  zoom: 4
});

map.addControl(new mapboxgl.Navigation());

//Grab your current location and set that as the new center

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var success = function(p)
{
  var lng = p.coords.longitude;;
  var lat = p.coords.latitude
  map.flyTo({ center: [lng,lat] , zoom: 9});
}

var fail = function(err)
{
}
navigator.geolocation.getCurrentPosition(success, fail, options);

var popup = new mapboxgl.Popup();

map.on('style.load', function() {
         map.addSource("parks",{
           "type" : "geojson",
           "data" : "/json/parks.json"
         });

         map.addSource("airports", {
           "type" : "geojson",
           "data" : "/json/airports.json"
         });

         map.addSource("fortmac", {
           "type" : "geojson",
           "data" : "/json/fortmac.json"
         });

         map.addSource("bcwildfire", {
             "type" : "geojson",
             "data" : "/json/bcwildfire.json"
         })

         map.addLayer({
           "id" :"airport-fills",
           "type": "fill",
           "interactive": true,
           "layout" : {},
           "source" : "airports",
           "paint" : {
             "fill-color" : "#ff0000",
             "fill-opacity" : 0.2
           }
         });

         map.addLayer({
           "id" : "parks-fills",
           "type" : "fill",
           "interactive" : true,
           "layout" : {},
           "source" : "parks",
           "paint" : {
             "fill-color" : "#ff0000",
             "fill-opacity" : 0.2
           }
        });

         map.addLayer({
           "id" :"fortmac-fills",
           "type": "fill",
           "interactive": true,
           "layout" : {},
           "source" : "fortmac",
           "paint" : {
             "fill-color" : "#ff0000",
             "fill-opacity" : 0.2
           }
         });

         map.addLayer({
           "id" :"bcwildfire-fills",
           "type": "fill",
           "interactive": true,
           "layout" : {},
           "source" : "bcwildfire",
           "paint" : {
             "fill-color" : "#ff0000",
             "fill-opacity" : 0.5
           }
         });



        map.on('click', function (e) {
          map.featuresAt(e.point, {
            radius: 5,
            layers: ['airport-fills', 'parks', 'fortmac-fills']
          }, function(err, features) {
            var display = "";
            if(!err || features.length) {
              for(var i = 0; i < features.length; ++i) {
                if(features[i].layer.id == "airport-fills") {
                  display += features[i].properties.Type + " : " 
                    + features[i].properties.Name + "<br />";
                }
                else if(features[i].layer.id == "parks-fills") {
                  display += "National Park: " + features[i].properties.NAME_E + "</br >";
                }
                else if(features[i].layer.id == "fortmac-fills") {
                  display += "Fort McMurray Fire Exclusion Zone <br />";
                }
                else if(features[i].layer.id == "bcwildfire-fills") {
                  display += "BC Wildfire: Forest Fire! DO NOT FLY! <br />"
                }
              }
              if(display.length > 0) {
                popup.setLngLat([e.lngLat.lng, e.lngLat.lat])
                  .setHTML(display)
                  .addTo(map);
              }
            }
            else
            {
              popup.close();
              return;
            }
          });
        });
});

var close_about = function(e)
{
  var about = document.getElementById("about");
  about.style.display = "none";
}
var open_about = function(e)
{
  var about = document.getElementById("about");
  about.style.display = "block";
}


var element = document.getElementById("close_data");
element.addEventListener("click", close_about, false);
var widget = document.getElementById("widget");
widget.addEventListener("click", open_about, false);

navigator.geolocation.getCurrentPosition(success, fail, options);
