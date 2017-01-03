function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
       center: {
           lat: 39.7576958,
           lng: -105.00724629999999
       },
       zoom: 2
   });
   // heatmap = new google.maps.visualization.HeatmapLayer({
   //     data: getPoints(),
   //     map: map
   // });
}
$(document).ready(function() {
   navigator.geolocation.getCurrentPosition(function(position) {
       latPosition = position.coords.latitude;
       longPosition = position.coords.longitude;
       $.get('https://galvanize-cors-proxy.herokuapp.com/api.parkwhiz.com/search/?lat=' + latPosition + '&lng=' + longPosition + '&max_distance=10000&start=1483398004&end=1483398500&key=62d882d8cfe5680004fa849286b6ce20')
           .done(function(data) {
               console.log(data);
               parkWhizHeatMap(data)
               $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latPosition + ',' + longPosition + '&key=AIzaSyB6mjYhp5ca_RPpOdHu_Ul7E-YY6BYzmms')
                   .done(function(data) {
                      //  console.log(data);
                       initialize()
                   })
                   .fail(function(error) {
                       console.log(error);
                   })
               console.log(latPosition, longPosition);
           })
           .fail(function(error) {
               console.log('error');
           })
   })
   var heatmap;
   var points = [];

   //this function returns location data to create the heatmap
   function getPoints() {
       var seedPoints = [
           new google.maps.LatLng(39.75995, -105.0070583),
           new google.maps.LatLng(39.75995, -105.0070583),
           new google.maps.LatLng(39.75995, -105.0070583)
       ]
       for (var i = 0; i < seedPoints.length; i++) {
           points.push(seedPoints[i])
       }
      //  console.log(points);
       return points;
   };

   function parkWhizHeatMap(data) {
       for (var i = 0; i < data.parking_listings.length; i++) {
           var lat = data.parking_listings[i].lat
           var lng = data.parking_listings[i].lng;
           points.push(new google.maps.LatLng(lat, lng))
       }
      //  console.log(points);
   }

   //this function creates the map with the heatmap included. It runs after the document is loaded and the
   // geolocation function has returned coordinates for the users current location
   function initialize() {
      //  console.log(points);
       var myLatLng = new google.maps.LatLng(latPosition, longPosition);
       map = new google.maps.Map(document.getElementById('map'), {
           center: {
               lat: latPosition,
               lng: longPosition
           },
           zoom: 16,
           mapTypeId: google.maps.MapTypeId.ROADMAP
       });
       heatmap = new google.maps.visualization.HeatmapLayer({
           data: getPoints(),
           map: map
       });
      //  var userMarker = new google.maps.Marker({
          //  position: myLatLng,
          //  map: map,
          //  icon: 'spotninja.png'
      //  });
   }

   function fail() {
       alert('navigator.geolocation failed, may not be supported');
   }
})
