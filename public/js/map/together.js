var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
}),
    latlng = L.latLng(-37.82, 175.24)

var map = L.map('map-main', { center: latlng, zoom: 13, layers: [tiles] });

var mcgLayerSupportGroup = L.markerClusterGroup.layerSupport(),
    group1 = L.layerGroup(),
    group2 = L.layerGroup(),
    control = L.control.layers(null, null, { collapsed: false }),
    i, a, title, marker;

mcgLayerSupportGroup.addTo(map);

cat1 = L.marker([-37.82, 175.24]);
cat2 = L.marker([-37.83, 175.24]);
cat3 = L.marker([-37.84, 175.24]);
cat1.addTo(group1);
cat2.addTo(group1);
cat3.addTo(group1);

dog1 = L.marker([-37.82, 175.4]);
dog2 = L.marker([-37.83, 175.5]);
dog3 = L.marker([-37.84, 175.6]);
dog1.addTo(group2);
dog2.addTo(group2);
dog3.addTo(group2);
mcgLayerSupportGroup.checkIn([group1]);
mcgLayerSupportGroup.checkIn([group2]);

control.addOverlay(group1, 'Cat');
control.addOverlay(group2, 'Dog');

control.addTo(map);
{}
group1.addTo(map); // Adding to map or to AutoMCG are now equivalent.
map.removeLayer(cat3)
group2.addTo(map);