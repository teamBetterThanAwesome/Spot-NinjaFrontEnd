  const $statusMessage = $('#statusMessage');
  const $progressBar = $('#progressBar');


$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let heatPoints = [];
        let userLocation = {
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        };
        userLatLng = new google.maps.LatLng(userLocation.userLat, userLocation.userLng);
        getHeatMapPoints().then(function(heat) {
            initFullMap(userLocation, heat);
        });
        $statusMessage.text('Creating Map');
        $progressBar.width('22%');
        var input = document.getElementById('searchTextField');
        var options = {
            types: ['establishment']
        };
        autocomplete = new google.maps.places.Autocomplete(input, options);

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            let mylocation = autocomplete.getPlace();
            let locationArr = mylocation.geometry.location.toString().replace(/[{(),}]/g, '').split(' ');
            let userInfo = {
                userLat: parseFloat(locationArr[0]),
                userLng: parseFloat(locationArr[1])
            };
            let userLatLng = new google.maps.LatLng(userInfo.userLat, userInfo.userLat);
            getHeatMapPoints().then(function(heat) {
                initFullMap(userInfo, heat);
            });
        });


        //this function returns location data to create the heatmap
        function getHeatMapPoints() {
            $statusMessage.text("Finding Other Ninjas' Parking Spots")
            if (heatPoints.length > 0) {
                return Promise.resolve(heatPoints)
            } else {
                return $.get(`${API_URL}/spots/`).then((spots) => {
                    return spots.map(spot => {
                        // console.log(spot.lat, spot.lng);
                        return (new google.maps.LatLng(spot.lat, spot.lng))
                    });
                }).then(function(heat) {
                    heatPoints = heat;
                    return heatPoints
                })
            }
        }

        //this function creates the map with the heatmap included. It runs after the document is loaded and the
        // geolocation function has returned coordinates for the users current location
        function initFullMap(userLocation, heatPoints) {
          var userLatLng = new google.maps.LatLng(userLocation.userLat, userLocation.userLng);
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
            getParkWhizData(userLocation)
        }

        function getParkWhizData(userInfo) {
            $statusMessage.text('Finding Paid Parking Near You')
            $progressBar.width('56%');
            $.ajax({
                    type: 'GET',
                    url: API_URL,
                    data: userLocation,
                    dataType: 'json'
                })
                .done(function(data) {
                    displayPaidParkingData(data)
                })
        }

        function displayPaidParkingData(data) {
           $statusMessage.text('Plotting Paid Parking')
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
          $statusMessage.text('Sorting Parking Options')
          $progressBar.width('93%');
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
            $('.hideWhenDone').hide();
            $('.showWhenDone').show();
            center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center); 
        }
    })
})
