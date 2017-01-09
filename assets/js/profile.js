const $progressBar = $('#progressBar');
const $statusMessage = $('#statusMessage');


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
          $statusMessage.text('Creating Map');
          $progressBar.width('20%')
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
          $statusMessage.text('Tracking Down Your Spots')
          $progressBar.width('45%');
            $.ajax({
                    type: 'GET',
                    url: `${API_URL}/spots/${userId}`,
                    dataType: 'json'
                })
                .then(function(data) {
                  createParkingSpotMarkers(data)
                  spotList(data)
                })
        }



        function createParkingSpotMarkers(array) {
          $statusMessage.text('Visualizing Your Data')
          $progressBar.width('86%');
            array.forEach(function(spot){
            var latLng = new google.maps.LatLng(spot.lat, spot.lng);
            var spotMarker = new google.maps.Marker({
                map: map,
                position: latLng,
                icon: 'assets/images/car.png'
            });

            var html = `<h3>${spot.comment}</h3>
                <p>Lattitude: ${spot.lat}</p>
                <p>Longitude: ${spot.lng}</p>
                <p>Rating: ${spot.rating}</p>
                `
            var infowindow = new google.maps.InfoWindow({
                content: html
            });

            spotMarker.addListener('click', function() {
                infowindow.open(map, spotMarker);
            });
              })
        }
        function spotList(userSpots){
          if (userSpots.length === 0){
            $('#noSpots').show();
            $('#winkNinja').show();
            $('.hideWhenDone').hide();
            $('.showWhenDone').show();
            var center = map.getCenter();
            google.maps.event.trigger(map, 'resize');
            map.setCenter(center);
          } else{
          userSpots.forEach(function(spot){
              $('#parkingList').append(`
                <li class="list-group-item row">
                  ${spot.comment}
                  <div class="pull-right">
                    <a class="btn btn-default updateButton " data-spot="${spot.id}">Update</a>
                    <a class="btn btn-default removeButton" data-spot="${spot.id}">Delete</a>
                  </div>
                </li>`);

          })
          updateSpot(userSpots);
          deleteSpot(userSpots);
          $('.hideWhenDone').hide();
          $('.showWhenDone').show();
          var center = map.getCenter();
          google.maps.event.trigger(map, 'resize');
          map.setCenter(center);
          }
}

    })

function updateSpot(data){
  $statusMessage.text('Getting Ninjas In Order')
  $progressBar.width('97%')
  $('.updateButton').on('click', function(){
    let spotId = $(this).data();
    window.location = `/edit.html?id=${spotId.spot}`;
  });
}


function deleteSpot(data){
  $('.removeButton').on('click', function(){
    let spotId = $(this).data();
    $.ajax({
      url: `${API_URL}/spots/${spotId.spot}`,
      type: 'DELETE',
      dataType: 'json',
      success: function(){
        window.location = `/profile.html?id=${localStorage.user_id}`;
      }
    })
  });



}
