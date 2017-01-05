//******************* Variables
const Heroku = 'https://spotninja.herokuapp.com/'
const Local = 'http://localhost:3000/'

$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let userLocation = {
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        };
        userLatLng = new google.maps.LatLng(userLocation.userLat, userLocation.userLng);

        $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + userLocation.userLat + ',' + userLocation.userLng + '&key=AIzaSyB6mjYhp5ca_RPpOdHu_Ul7E-YY6BYzmms')
            .done(function(data) {
                let heat = (getHeatMapPoints());
                initFullMap(userLocation, heat);
            })
            .fail(function(error) {
                console.log("hi");
            })
    })

    // var defaultBounds = new google.maps.LatLngBounds(
    //     new google.maps.LatLng(39.75995, -105.0070583),
    //     new google.maps.LatLng(39.75001, -105.0070599));

    var input = document.getElementById('searchTextField');
    var options = {
        // bounds: defaultBounds,
        types: ['establishment']
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);


    //Find user input from searchbar, get lat and lng of that location and update map!
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        let mylocation = autocomplete.getPlace();
        $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${mylocation.formatted_address}&key=AIzaSyB6mjYhp5ca_RPpOdHu_Ul7E-YY6BYzmms`)
            .done(function(data) {
                let heat = (getHeatMapPoints());
                let location = data.results[0].geometry.location;
                let userInfo = {
                    userLat: location.lat,
                    userLng: location.lng
                }
                let userLatLng = new google.maps.LatLng(location.lat, location.lng);
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {
                        lat: location.lat,
                        lng: location.lng
                    },
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                heatmap = new google.maps.visualization.HeatmapLayer({
                    data: heat,
                    map: map
                });
                var userMarker = new google.maps.Marker({
                    position: userLatLng,
                    map: map,
                    icon: 'assets/images/logoninjasmall.png'
                });
                getParkWhizData(userInfo);
            });
    });
});

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
            url: Local,
            data: userInfo,
            dataType: 'json'
        })
        .done(function(data) {
            console.log(data);
            displayPaidParkingData(data)
        })
}

function displayPaidParkingData(data) {
    for (var i = 0; i < data.length; i++) {
        var parkingGaragesObject = {
            lat: data[i]._embedded['pw:location'].entrances[0].coordinates[0],
            lng: data[i]._embedded['pw:location'].entrances[0].coordinates[1],
            address: data[i]._embedded['pw:location'].address1,
            name: data[i]._embedded['pw:location'].name,
            distance: data[i].distance.straight_line.feet,
            rating: data[i]._embedded['pw:location'].rating_summary.average_rating,
            price: data[i].purchase_options[0].price['USD']
        }
        createPaidParkingMarkers(parkingGaragesObject)
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
                <p>${object.distance} feet away.</p>
                <p>rating: ${object.rating}</p>
                <p>price: ${object.price}</p>
                `

    var infowindow = new google.maps.InfoWindow({
        content: html
    });
    paidParkingMarker.addListener('click', function() {
        infowindow.open(map, paidParkingMarker);
    });

}
