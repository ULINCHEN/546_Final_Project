// open street map from https://www.openstreetmap.org/copyright and leaftet function fron https://leafletjs.com/examples.html
const singleLocation = (location, name, species, address) => {
    if (location) {
        const map = L.map('map').setView([location[0], location[1]], 15);
        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        const marker = L.marker([location[0], location[1]], {alt: "strayed " + species + " animal " + name + " at the " + address}).addTo(map);
    }
    else {
        const map = L.map('map').setView([40.7447099, -74.0289506], 15);
        const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        // const marker = L.marker([40.7447099, -74.0289506], {alt: "strayed " + species + " " + name }).addTo(map);
    }
}
