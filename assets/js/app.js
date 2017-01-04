//******************* Variables
const Heroku = 'https://spotninja.herokuapp.com/'
const Local = 'http://localhost:3000/'








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
        let userLocation = {
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        };
        userLatLng = new google.maps.LatLng(userLocation.userLat, userLocation.userLng);

        $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + userLocation.userLat + ',' + userLocation.userLng + '&key=AIzaSyB6mjYhp5ca_RPpOdHu_Ul7E-YY6BYzmms')
            .done(function(data) {
                $.get('https://galvanize-cors-proxy.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=AIzaSyB6mjYhp5ca_RPpOdHu_Ul7E-YY6BYzmms&libraries=places')
                    .done(function(data) {
                        console.log(data);
                    })
                console.log(data);
                let heat = (getHeatMapPoints());
                initFullMap(userLocation, heat);
            })
            .fail(function(error) {
                console.log(error);
            })
    })
})

//this function returns location data to create the heatmap
function getHeatMapPoints() {
    let points = [];
    $.get(`${Heroku}spots/`, (spots) => {
        spots.forEach(spot => {
            // console.log(spot.lat, spot.lng);
            points.push(new google.maps.LatLng(spot.lat, spot.lng))
        });
    });


    // var points = [];
    // var seedPoints = [
    //     new google.maps.LatLng(39.75995, -105.0070583),
    //     new google.maps.LatLng(39.75995, -105.0070583),
    //     new google.maps.LatLng(39.75995, -105.0070583)
    // ]
    // for (var i = 0; i < seedPoints.length; i++) {
    //     points.push(seedPoints[i])
    // }
    // console.log(points);
    return points;
};

//this function creates the map with the heatmap included. It runs after the document is loaded and the
// geolocation function has returned coordinates for the users current location
function initFullMap(userInfo, heatData) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: userInfo.userLat,
            lng: userInfo.userLng
        },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatData,
        map: map
    });
    var userMarker = new google.maps.Marker({
        position: userLatLng,
        map: map,
        icon: 'assets/images/logoninjasmall.png'
    });
    getParkWhizData(userInfo)
}

function getParkWhizData(userInfo) {
    $.ajax({
            type: 'GET',
            url: Heroku,
            data: userInfo,
            dataType: 'json'
        })
        .done(function(data) {
          console.log(data);
            displayPaidParkingData(data)
        })

}

function displayPaidParkingData(data) {
    for (var i = 0; i < data.parking_listings.length; i++) {
      var passObject = {
        lat: data.parking_listings[i].lat,
        lng: data.parking_listings[i].lng,
        price: data.parking_listings[i].price_formatted,
        address: data.parking_listings[i].address,
        name: data.parking_listings[i].location_name,
        distance: data.parking_listings[i].distance
      }
        createPaidParkingMarkers(passObject)
    }
}

function createPaidParkingMarkers(object) {

    var latLng = new google.maps.LatLng(object.lat, object.lng);
    var paidParkingMarker = new google.maps.Marker({
        map: map,
        position: latLng,
        icon: 'assets/images/dollarsign.png'
    });

    var html = `<h3>${object.name}</h3>
                <p>${object.address}</p>
                <p>${object.price}</p>
                <p>${object.distance} feet away.</p>
                `

    var infowindow = new google.maps.InfoWindow({
        content: html
    });
    paidParkingMarker.addListener('click', function() {
    infowindow.open(map, paidParkingMarker);
  });
}
