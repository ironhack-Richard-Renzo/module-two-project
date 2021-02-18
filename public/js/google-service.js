var latitude, longitude, map, marker;

if (document.getElementById("lat-input").value !== '') {
    latitude = Number(document.getElementById("lat-input").value);
} else {
    latitude = 40.416775;
}

if (document.getElementById("lng-input").value !== '') {
    longitude = Number(document.getElementById("lng-input").value);
} else {
    longitude = -3.703790;
}

var coordinates = { lat: latitude, lng: longitude };

// Initialize and add the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: coordinates,
        zoom: 18,
        zoomControl: true,
        mapTypeId: 'satellite',
        heading: 90,
        tilt: 0,
        disableDefaultUI: true,
        disableDoubleClickZoom: true
    });

    input = document.getElementById('places-input');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        onPlaceChanged(place);
    });

    marker = new google.maps.Marker({
        position: coordinates,
        map: map,
    });

    google.maps.event.addListener(map, 'dblclick', function(e) {
        onPlaceClicked(e.latLng);
    });
}

function onPlaceChanged(place) {

    map.panTo(place.geometry.location);
    map.setZoom(18);
    marker.setPosition(place.geometry.location);
    document.getElementById("lat-input").value = place.geometry.location.lat();
    document.getElementById("lng-input").value = place.geometry.location.lng();
}

function onPlaceClicked(latLng) {
    map.panTo(latLng);
    marker.setPosition(latLng);
    document.getElementById("lat-input").value = latLng.lat();
    document.getElementById("lng-input").value = latLng.lng();
}