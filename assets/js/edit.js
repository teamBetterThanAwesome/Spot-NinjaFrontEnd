$(() => {
  const parsedParts = window.location.search.split('=');
  const id = parsedParts[1];

  getSpot(id)
    .then(spot => {
      $('#lat').val(spot.lat);
      $('#lng').val(spot.lng);
      $('#comments').val(spot.comment);
      $(`option[value=${spot.rating}]`).attr('selected', 'selected');
    });


  $('#updateSpot').on('click',(event) => {
    event.preventDefault();
    sendToServer(id);
  });
});


function sendToServer(id) {
  let spot = {
    lat: $('#lat').val(),
    lng: $('#lng').val(),
    rating: $('#rating').val(),
    comment: $('#comments').val(),
    user_id: id,
    two_hr: $('input[name="twoHour"]:checked').val(),
    all_day: $('input[name="allDay"]:checked').val(),
    night: $('input[name="overnight"]:checked').val()
  };

  $.ajax({
    type: 'PUT',
    dataType: 'json',
    url: `${API_URL}/spots/${id}`,
    data: spot
  }).then(result => {
    redirectIfLoggedIn();
  });
}
