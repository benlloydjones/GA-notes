/* global google:ignore */

$(() => {
  console.log('JS loaded');

  const $map = $('.map'); // grab map div from DOM
  let map = null; // define somewhere to store the Google map object
  let locations = null; // this will eventually be the array of bike points from the TFL API
  let infowindow = null; // create a global variable to store an individual info window object - this allows us to close an existing open infowindow later if we want to
  const $form = $('form');
  let markers = [];

  initMap();
  $form.find('input').on('change', updateMap);

  function initMap() {
    const latLng = { lat: 51.515213, lng: -0.072331 };
    // create a new Google map and store it inside the global map variable for later
    map = new google.maps.Map($map.get(0), {
      zoom: 14,
      center: latLng
    });

    getBikes();
  }

  function getBikes() {
    // make a request to the TFL API to get the bike point data
    $.get('https://api.tfl.gov.uk/bikepoint')
      .done((response) => {
        locations = response; // store the bike points in a global variable for use later
        // loop through the bike point locations and add a marker for each one
        locations.forEach((location) => {
          location.noOfBikes = location.additionalProperties.find(obj =>  obj.key === 'NbBikes').value;
          location.noOfSpaces = location.additionalProperties.find(obj =>  obj.key === 'NbEmptyDocks').value;
          // run this function once for each bike point location, and pass in the location object
          addMarker(location);
        });
      });
  }

  function addMarker(location) {
    // create an object in the correct format for Google maps to use ('lat' and 'lng' as keys, values as numbers)
    const latLng = { lat: location.lat, lng: location.lon };
    // create a new marker, and declare which map to add it to
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: 'images/dot.svg'
    });

    // pushing marker into global markers array
    markers.push(marker);

    // add an event listener to each marker on the map
    marker.addListener('click', () => {
      // when the marker is clicked, run the createInfoWindow function, and pass in the marker object and the location object
      createInfoWindow(marker, location);
    });
  }

  function createInfoWindow(marker, location) {
    // if an infowindow already exists, close it
    if(infowindow) infowindow.close();

    // overwrite the existing infowindow with a new infowindow, and define the content that you want it to hold
    // you can add HTML with classes/ids etc. here
    infowindow = new google.maps.InfoWindow({
      content: `
        <div class="infowindow">
          <h3>${location.commonName}</h3>
          <p>Available bikes: <strong>${location.noOfBikes}</strong></p>
          <p>Available spaces: <strong>${location.noOfSpaces}</strong></p>
        </div>
      `
    });
    // finally, open the infowindow, and declare which map and which marker it should open over
    infowindow.open(map, marker);
  }

  function updateMap(e) {
    // remove all of the markers from the map
    clearMarkers();
    // store the value of the radio that has been clicked
    // this will be a string, for example 'all', 'bikes', 'spaces'
    const choice = $(e.target).val();

    // depending on the choice, run a different function
    switch(choice) {
      case 'all':
        getBikes();
        break;
      case 'bikes':
        showAvailableBikes();
        break;
      case 'spaces':
        showAvailableSpaces();
        break;
    }
  }

  // loop through the cached array of locations
  function showAvailableBikes() {
    locations.forEach((location) => {
      // if the number of available bikes is over 16, add a marker
      if(location.noOfBikes > 16) addMarker(location);
    });
  }

  function showAvailableSpaces() {
    // loop through the cached array of locations
    locations.forEach((location) => {
      // if the number of available spaces is over 16, add a marker
      if(location.noOfSpaces > 16) addMarker(location);
    });
  }

  function clearMarkers() {
    // loop through each marker and remove it from the map
    markers.forEach(marker => marker.setMap(null));
    // empty out the markers array
    markers = [];
  }

});
