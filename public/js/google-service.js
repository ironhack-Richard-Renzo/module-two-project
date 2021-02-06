// Initialize and add the map
function initMap() {
    const madrid = { lat: 40.416775, lng: -3.703790 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: madrid,
        zoom: 18,
        zoomControl: true,
        mapTypeId: 'satellite',
        heading: 90,
        tilt: 0,
        disableDefaultUI: true
    });

    input = document.getElementById('places-input');
    autocomplete = new google.maps.places.Autocomplete(this.input);
    autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        onPlaceChanged(place);
    });

    const marker = new google.maps.Marker({
        position: madrid,
        map: map,
    });
}

function onPlaceChanged(place) {
    currentUser.latitude = place.geometry.location.lat();
    currentUser.longitude = place.geometry.location.lng();
    this.map.panTo(place.geometry.location);
    this.map.setZoom(18);
    this.marker.setPosition(place.geometry.location);
}