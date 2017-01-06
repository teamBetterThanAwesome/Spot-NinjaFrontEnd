$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let heatPoints = [];
        let userLocation = {
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        };
        userLatLng = new google.maps.LatLng(userLocation.userLat, userLocation.userLng);
        getHeatMapPoints().then(function(heat) {
            console.log(heat);
            initFullMap(userLocation, heat);
        });

        var input = document.getElementById('searchTextField');
        var options = {
            // bounds: defaultBounds,
            types: ['establishment']
        };
        autocomplete = new google.maps.places.Autocomplete(input, options);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            let mylocation = autocomplete.getPlace();
            $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${mylocation.formatted_address}&key=AIzaSyB6mjYhp5ca_RPpOdHu_Ul7E-YY6BYzmms`)
                .done(function(data) {
                    getHeatMapPoints().then(function(heatPoints) {
                        let heat = heatPoints
                        let location = data.results[0].geometry.location;
                        let userInfo = {
                            userLat: location.lat,
                            userLng: location.lng
                        }
                        let userLatLng = new google.maps.LatLng(location.lat, location.lng);
                        console.log(userLatLng);
                        map = new google.maps.Map(document.getElementById('map'), {
                            center: {
                                lat: location.lat,
                                lng: location.lng
                            },
                            zoom: 16,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });
                        heatmap = new google.maps.visualization.HeatmapLayer({
                            data: heatPoints,
                            map: map
                        });
                        var userMarker = new google.maps.Marker({
                            position: userLatLng,
                            map: map,
                            icon: 'assets/images/logoninjasmall.png'
                        });
                    })

                });
        });

        function initFullMap(userLocation, heatPoints) {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: userLocation.userLat,
                    lng: userLocation.userLng
                },
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatPoints,
                map: map
            });
            var userMarker = new google.maps.Marker({
                position: userLatLng,
                map: map,
                icon: 'assets/images/logoninjasmall.png'
            });

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
    })
})
