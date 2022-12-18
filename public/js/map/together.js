function addTogether(infoArray) {
    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
    }),
        hoboken = L.latLng(40.745255, -74.034775)

    var map = L.map('map-main', { center: hoboken, zoom: 13, layers: [tiles] });

    var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport(),
        cats = L.featureGroup(),
        dogs = L.featureGroup(),
        other = L.layerGroup(),
        control = L.control.layers(null, null, null, { collapsed: false }),
        i, a, title, marker;

    mcgLayerSupportGroup.addTo(map);

    infoArray.forEach(function (info) {
        var id = info.id;
        var name = info.name;
        var date = info.date;
        var healfh = info.health;
        var lat = info.lat;
        var lng = info.lng;
        var description = info.description;
        var url = info.url;
        var species = info.species;
        if (healfh == "bad") {
            var redIcon = new L.Icon({
            iconUrl: '/public/images/marker-icon-2x-red.png',
            shadowUrl: '/public/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            className: id
            });

            var marker = L.marker([lat, lng], {
                icon: redIcon
            });
        }
        else if (healfh == "good") {
            var greenIcon = new L.Icon({
                iconUrl: '/public/images/marker-icon-2x-green.png',
                shadowUrl: '/public/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                className: id
            });
            var marker = L.marker([lat, lng], {
                icon: greenIcon
            });
        }
        else {
            var normalIcon = new L.Icon({
                iconUrl: '/public/images/marker-icon-2x-blue.png',
                shadowUrl: '/public/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                className: id
            });
            var marker = L.marker([lat, lng], {
                icon: normalIcon
            });
        }

        if (species == "cat") {
            marker.addTo(cats).bindPopup(name + "<br>" + healfh + "<br>" + date)
        }
        else if (species == "dog") {
            marker.addTo(dogs).bindPopup(name + "<br>" + healfh + "<br>" + date);
        }
        else {
            marker.addTo(other).bindPopup(name + "<br>" + healfh + "<br>" + date);
        }
        marker.on('click', event => {
            const view = document.getElementById(id);
            view.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        marker.on('dclick', event => {
            
        });
    });

    mcgLayerSupportGroup.checkIn([cats]);
    mcgLayerSupportGroup.checkIn([dogs]);
    mcgLayerSupportGroup.checkIn([other]);

    control.addOverlay(cats, 'Cat');
    control.addOverlay(dogs, 'Dog');
    control.addOverlay(other, 'Other');
    control.addTo(map);

    cats.addTo(map);
    dogs.addTo(map);
    other.addTo(map);
}   
