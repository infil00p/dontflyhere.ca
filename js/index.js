/*
 * Copyright 2016 Joe Bowser
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
map.addControl(new mapboxgl.Geocoder());

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

         map.addSource("navcan_sfc", {
             "type" : "geojson",
             "data" : "/json/canadian_airspace_sfc.geojson"
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

         map.addLayer({
           "id" :"navcan-fills",
           "type": "fill",
           "interactive": true,
           "layout" : {},
           "source" : "navcan_sfc",
           "paint" : {
             "fill-color" : "#ff0000",
             "fill-opacity" : 0.2
           }
         });




        map.on('click', function (e) {
          var features = map.queryRenderedFeatures(e.point, {layers: ['airport-fills', 'parks-fills', 'fortmac-fills', 'navcan-fills']});
          var display = "";
          if(features.length) {
              for(var i = 0; i < features.length; ++i) {
                if(features[i].layer.id == "airport-fills") {
                  display += features[i].properties.Type + " : " 
                    + features[i].properties.Name + "<br />";
                }
                else if(features[i].layer.id == "parks-fills") {
                  display += "National Park: " + features[i].properties.NAME_E + "</br >";
                  console.log("ParksCanada");
                }
                else if(features[i].layer.id == "fortmac-fills") {
                  display += "Fort McMurray Fire Exclusion Zone <br />";
                }
                else if(features[i].layer.id == "bcwildfire-fills") {
                  display += "BC Wildfire: Forest Fire! DO NOT FLY! <br />";
                }
                else if(features[i].layer.id == "navcan-fills") {
                  display += "Restricted Airspace <br />"
                    + features[i].properties.TITLE + "<br />"
                    + "Type: " + features[i].properties.TYPE + "<br />"
                    + "Class: " + features[i].properties.CLASS + "<br />";
                }
              }
              if(display.length > 0) {
                console.log(display);
                var popup = new mapboxgl.Popup()
                  .setLngLat([e.lngLat.lng, e.lngLat.lat])
                  .setHTML(display)
                  .addTo(map);
              }
        }
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
