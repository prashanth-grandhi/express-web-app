var map;
var heatmap;
var poly;
var markers = [];
var paths;
var selectList;

// Initializes map and setup form elements
function initMap() {
    var latitude = 60.1675;
    var longitude = 24.9311;
    paths = new Array();
    console.log("Initialize Map: " + latitude, longitude);
    var googleLatLong = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        zoom: 14,
        lat: latitude,
        lng: longitude,
        center: googleLatLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);

    poly = new google.maps.Polyline({strokeColor: '#000000', strokeOpacity: 1.0, strokeWeight: 3});
    poly.setMap(map);

    map.addListener('click', function(e) {
        if (markers.length < 10) {
            addPoint(e);
        } else {
            console.log("Maximum coordiantes to plot is 10");
        }
    });

    heatmap = new google.maps.visualization.HeatmapLayer({map: map});

    var clearButton = document.getElementById("clear-path");
    clearButton.onclick = function(e) {
        e.preventDefault();
        clearPath();
    };

    var saveButton = document.getElementById("save-path");
    saveButton.onclick = function(e) {
        e.preventDefault();
        savePath();
    };

    selectList = document.getElementById("myform").elements["paths"];
    selectList.onclick = function(e) {
        if (selectList.options.length > 0) {
            addMarkersAndLine(selectList.value - 1);
        }
    };

    var heatMapButton = document.getElementById("heatmap");
    heatMapButton.onclick = function(e) {
        e.preventDefault();
        showHeatMap();
    };

    var saveJsonButton = document.getElementById("save-json");
    saveJsonButton.onclick = function(e) {
        e.preventDefault();
        sendJson();
    };
}

// Creates a path coordinate on map
function addPoint(event) {
    var path = poly.getPath();
    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(event.latLng);

    var options = {
        position: event.latLng,
        map: map,
        clickable: true
    };
    var marker = new google.maps.Marker(options);
    markers.push(marker);
}

// Saves path coordinates to list box
function savePath() {
    if (markers.length > 1) {
        if (paths.length < 10) {
            var coordinates = [];
            markers.forEach(function(marker) {
                coordinates.push(marker.getPosition());
            });
            paths.push(coordinates);

            var text = "Path " + paths.length;
            var option = document.createElement("option");
            option.value = paths.length;
            option.innerHTML = text;
            selectList.appendChild(option);
        } else {
            console.log("Paths to save has reached maximum limit");
        }
    }
}

// Clear path coordinates from the map
function clearPath() {
    clearLine();
    clearMarkers();
}

// Clear polylines from the map
function clearLine() {
    // Remove polyline from the map
    poly.setMap(null);

    // Reset polyline
    poly = null;
    poly = new google.maps.Polyline({strokeColor: '#000000', strokeOpacity: 1.0, strokeWeight: 3});
    poly.setMap(map);
}

function clearMarkers() {
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];
}

// Add saved path coordinates to the map
function addMarkersAndLine(index) {
    clearPath();

    var coordinates = paths[index];
    coordinates.forEach(function(latLng) {
        var options = {
            position: latLng,
            map: map,
            clickable: true
        };
        var marker = new google.maps.Marker(options);
        markers.push(marker);
    });

    poly = new google.maps.Polyline({path: coordinates, geodesic: true, strokeColor: '#000000', strokeOpacity: 1.0, strokeWeight: 2});
    poly.setMap(map);
}

// Send all path coordinates json data to server
function sendJson() {
    if (paths.length > 0) {
        var jObject = new Object();
        var jArray = [];
        for (i = 0; i < paths.length; i++) {
            var jArray2 = [];
            var points = paths[i];
            for (j = 0; j < points.length; j++) {
                var obj = new Object();
                obj['lat'] = points[j].lat();
                obj['lng'] = points[j].lng();
                jArray2.push(obj);
            }
            jArray.push({coordinates: jArray2});
            jObject['paths'] = jArray;
        }

        console.log("jsonData: " + JSON.stringify(jObject, null, "    "));

        // Async ajax request to post json
        var http = new XMLHttpRequest();
        http.open("POST", 'http://localhost:8081/process_post', true);
        http.setRequestHeader("Content-type", "application/json;charset=utf-8");
        http.onreadystatechange = function() { //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                alert(http.responseText);
            }
        }
        http.send(JSON.stringify(jObject));
    }
}

// Show heat map
function showHeatMap() {
    if (selectList.options.length > 0) {
        heatmap.setData(getPoints());
    }
}

// Returns all saved path coordinates
function getPoints() {
    var arr = flattenArray(paths);
    console.log("Coordiantes data: " + arr);
    return arr;
}

function flattenArray(arr) {
    var flat = arr.reduce(function(a, b) {
        return a.concat(b);
    });
    return flat;
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap()
        ? null
        : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient')
        ? null
        : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius')
        ? null
        : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity')
        ? null
        : 0.2);
}

window.onload = function() {
    if (navigator.geolocation) {
        initMap();
    } else {
        alert("Sorry, this browser doesn't support geolocation!");
    }
}
