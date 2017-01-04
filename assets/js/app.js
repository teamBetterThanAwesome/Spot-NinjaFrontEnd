function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 39.7576958,
            lng: -105.00724629999999
        },
        zoom: 2
    });
}
$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        userLatLng = new google.maps.LatLng(userLat, userLng);
        $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + userLat + ',' + userLng + '&key=AIzaSyB6mjYhp5ca_RPpOdHu_Ul7E-YY6BYzmms')
            .done(function(data) {
                return initFullMap()
            })
            .fail(function(error) {
                console.log(error);
            })
    })
})

//this function returns location data to create the heatmap
function getHeatMapPoints() {
    var points = [];
    var seedPoints = [
        new google.maps.LatLng(39.75995, -105.0070583),
        new google.maps.LatLng(39.75995, -105.0070583),
        new google.maps.LatLng(39.75995, -105.0070583)
    ]
    for (var i = 0; i < seedPoints.length; i++) {
        points.push(seedPoints[i])
    }
    return points;
};

//this function creates the map with the heatmap included. It runs after the document is loaded and the
// geolocation function has returned coordinates for the users current location
function initFullMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: userLat,
            lng: userLng
        },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getHeatMapPoints(),
        map: map
    });
    var userMarker = new google.maps.Marker({
        position: userLatLng,
        map: map,
        icon: 'assets/images/logoninjasmall.png'
    });
    getParkWhizData()
}

function getParkWhizData() {
    $.get('https://galvanize-cors-proxy.herokuapp.com/api.parkwhiz.com/search/?lat=' + userLat + '&lng=' + userLng + '&max_distance=10000&start=1483398004&end=1483398500&key=62d882d8cfe5680004fa849286b6ce20')
        .done(function(data) {
            console.log(data);
            displayPaidParkingData(data)
        })
}

function displayPaidParkingData(data) {
    for (var i = 0; i < data.parking_listings.length; i++) {
        var lat = data.parking_listings[i].lat;
        var lng = data.parking_listings[i].lng;
        createPaidParkingMarkers(lat, lng)
    }
}

function createPaidParkingMarkers(lat, lng) {
    var latLng = new google.maps.LatLng(lat, lng);
    var paidParkingMarker = new google.maps.Marker({
        map: map,
        position: latLng,
        icon: 'assets/images/dollarsign.png'
    });
}
