angular.module('gservice', [])
    .factory('gservice', function () {

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var map;
        var googleMapService = {};

        var locations = [];
        var markers = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        googleMapService.addLocations = function (reports) {

            locations = convertToMapPoints(reports);

        };

        var convertToMapPoints = function (reports) {

            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for (var i = 0; i < reports.length; i++) {
                var node = reports[i];

                // Create popup windows for each record
                var contentString =
                    '<h4>' + node.NodeName + '</h4>';
                
                node.Reports.forEach(function(report){
                    contentString += '<b>Port ' + report.Port + '</b>: ' + report.Reading + '<br>';
                })

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(node.Latitude, node.Longtitude),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 150,
                    }),
                    id: node.NodeID,
                    value: node.Reading,
                });
            }

            return locations;
        };

        googleMapService.addMarker = function () {
            // Loop through each location in the array and place a marker
            markers.forEach(function (m, i){
                m.setMap(null);
            });
            markers = [];

            locations.forEach(function (n, i) {
                var marker = new google.maps.Marker({
                    position: n.latlon,
                    map: map,
                    title: "Big Map",
                    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'mouseover', function (e) {

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, marker);

                    google.maps.event.addListener(marker, 'click', function (e) {

                        // When clicked, keep the marker's message open
                        google.maps.event.clearListeners(marker, 'mouseout');
                        currentSelectedMarker = n;
                        google.maps.event.addListener(n.message, 'closeclick', function (e) {
                            google.maps.event.addListener(marker, 'mouseout', function (e) {
                                currentSelectedMarker = n;
                                n.message.close();
                            });
                        });
                    });
                });
                google.maps.event.addListener(marker, 'mouseout', function (e) {
                    currentSelectedMarker = n;
                    n.message.close();
                });

                markers.push(marker);
            });
        }

        googleMapService.panTo = function (latitude, longtitude, zoom) {
            var laLatLng = new google.maps.LatLng( latitude,  longtitude);
            map.panTo(laLatLng);
            map.setZoom(zoom);
        }

        // Initializes the map
        googleMapService.initialize = function () {
            // Uses the selected lat, long as starting point
            var myLatLng = { lat: selectedLat, lng: selectedLong };

            // If map has not been created already...
            if (!map) {

                // Create a new map and place in the index.html page
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 3,
                    center: myLatLng
                });
            }
            googleMapService.addMarker();
        };
        // Refresh the page upon window load. Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
            googleMapService.initialize());

        return googleMapService;
    });