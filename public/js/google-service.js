var madrid = { lat: 40.416775, lng: -3.703790 };
var map, marker;


// Initialize and add the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
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

    marker = new google.maps.Marker({
        position: madrid,
        map: map,
    });
}

function onPlaceChanged(place) {

    map.panTo(place.geometry.location);
    map.setZoom(18);
    marker.setPosition(place.geometry.location);
    document.getElementById("lat-input").value = place.geometry.location.lat();
    document.getElementById("lng-input").value = place.geometry.location.lng();
}