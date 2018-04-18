/* global google:ignore */

$(() => {
  const $map = $('.map');
  let map = null;
  let infowindow = null;
  let markers = [];
  const $cafes = $('.cafes');
  const $form = $('form');
  const $add = $('.add');
  const bounds = new google.maps.LatLngBounds();

  initMap();
  getCafes();

  $form.on('submit', addCafe);
  $cafes.on('click', 'button', deleteCafe);
  $add.on('click', toggleForm);

  function toggleForm() {
    $form.slideToggle(() => $form.find('input').val(''));
  }

  function deleteCafe(e) {
    const id = $(e.target).data('id');

    $.ajax({
      url: `http://localhost:3000/cafes/${id}`,
      method: 'DELETE'
    })
      .done(() => {
        getCafes();
      });
  }

  function removeMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
  }

  function addCafe(e) {
    e.preventDefault();

    const newCafe = {
      name: $form.find('[name="name"]').val(),
      address: $form.find('[name="address"]').val(),
      rating: $form.find('[name="rating"]').val(),
      longitude: $form.find('[name="longitude"]').val(),
      latitude: $form.find('[name="latitude"]').val(),
      image: $form.find('[name="image"]').val()
    };

    $.ajax({
      url: 'http://localhost:3000/cafes',
      method: 'POST',
      data: JSON.stringify(newCafe),
      contentType: 'application/json'
    })
      .then((cafe) => {
        addMarker(cafe);
        showCafe(cafe);
        toggleForm();
      });
  }

  function initMap() {
    const latLng = { lat: 51.515213, lng: -0.072331 };
    map = new google.maps.Map($map.get(0), {
      zoom: 12,
      center: latLng,
      scrollwheel: false
    });
  }

  function getCafes() {
    $.get('http://localhost:3000/cafes')
      .done((cafes) => {
        $cafes.empty();
        removeMarkers();
        cafes.forEach((cafe) => {
          addMarker(cafe);
          showCafe(cafe);
        });
        if (cafes.length) map.fitBounds(bounds);
      });
  }

  function showCafe(cafe) {
    const filledCups = ('<img src="images/icon.png" class="icon">').repeat(cafe.rating);
    const emptyCups = ('<img src="images/icon.png" class="icon icon-faded">').repeat(5 - cafe.rating);
    $cafes.prepend(`
      <div class="cafe">
        <div class="cafe-image" style="background-image: url('${cafe.image}'")></div>
        <h2>${cafe.name}</h2>
        <p>${cafe.address}</p>
        <p>${filledCups}${emptyCups}</p>
        <button data-id="${cafe.id}">Delete</button>
      </div>
    `);
  }

  function addMarker(cafe) {
    const latLng = { lat: cafe.latitude, lng: cafe.longitude };
    bounds.extend(latLng);
    const marker = new google.maps.Marker({
      position: latLng,
      map: map
    });

    marker.addListener('click', () => {
      createInfoWindow(marker, cafe);
    });

    markers.push(marker);

  }

  function createInfoWindow(marker, cafe) {
    if(infowindow) infowindow.close();

    const filledCups = ('<img src="images/icon.png" class="icon">').repeat(cafe.rating);
    const emptyCups = ('<img src="images/icon.png" class="icon icon-faded">').repeat(5 - cafe.rating);

    infowindow = new google.maps.InfoWindow({
      content: `
      <div class="infowindow">
        <h2>${cafe.name}</h2>
        <p>Address: ${cafe.address}</p>
        <p>${filledCups}${emptyCups}</p>
      </div>
      `
    });

    infowindow.open(map, marker);
  }
});
