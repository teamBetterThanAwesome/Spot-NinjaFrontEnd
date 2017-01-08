// const Heroku = 'https://spotninja.herokuapp.com/spots/new'
// const Local = 'http://localhost:3000/spots/new'


$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let userLocation = {
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        };
        $('#lat').val(userLocation.userLat);
        $('#lng').val(userLocation.userLng);
    });
    $('#submitSpot').on('click', function(userLocation) {
        event.preventDefault();
        sendToServer();
    });
});




function sendToServer() {
  let spot = {
    lat: $('#lat').val(),
    lng: $('#lng').val(),
    rating: $('#rating').val(),
    comment: $('#comments').val(),
    user_id: window.localStorage.user_id,
    two_hr: $('input[name="twoHour"]:checked').val(),
   all_day: $('input[name="allDay"]:checked').val(),
   night: $('input[name="overnight"]:checked').val()

 }

  $.post(`${API_URL}/spots/new`, spot)
    .then(redirectIfLoggedIn());
}
