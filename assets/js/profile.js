
$(document).ready(function() {
  const params = parseQuery(window.location.search)
  const userId = parseInt(params.id);
    navigator.geolocation.getCurrentPosition(function(position) {
        let userLocation = {
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        };
        userLatLng = new google.maps.LatLng(userLocation.userLat, userLocation.userLng);
            initFullMap(userLocation);
        });


        function parseQuery(query) {
            return query.substr(1).split('&').reduce((params, keyValue) => {
                const parts = keyValue.split('=');
                params[parts[0]] = parts[1];
                return params
            }, {});
        }


        function initFullMap(userLocation) {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: userLocation.userLat,
                    lng: userLocation.userLng
                },
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var userMarker = new google.maps.Marker({
                position: userLatLng,
                map: map,
                icon: 'assets/images/logoninjasmall.png'
            });
            getUserSpots(userId)
        }

        function getUserSpots(userId) {
            $.ajax({
                    type: 'GET',
                    url: `${API_URL}spots/user/${userId}`,
                    dataType: 'json'
                })
                .done(function(data) {
                    console.log(data);
                    createPaidParkingMarkers(data)
                })
        }



        function createPaidParkingMarkers(array) {
            array.forEach(function(spot){
            var latLng = new google.maps.LatLng(spot.lat, spot.lng);
            var paidParkingMarker = new google.maps.Marker({
                map: map,
                position: latLng,
                icon: 'assets/images/car.png'
            });


            var html = `<h3>${spot.id}</h3>
                <p>${spot.lat}</p>
                <p>${spot.lng}</p>
                <p>Rating: ${spot.rating}</p>
                <p>Comments: ${spot.comment}</p>
                `
            var infowindow = new google.maps.InfoWindow({
                content: html
            });

            paidParkingMarker.addListener('click', function() {
                infowindow.open(map, paidParkingMarker);
            });
              })
        }

    })
