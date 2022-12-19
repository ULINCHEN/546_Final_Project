// Geosearch from https://smeijer.github.io/leaflet-geosearch/
// open street map from https://www.openstreetmap.org/copyright and leaftet function fron https://leafletjs.com/examples.html
const providerOSM = new GeoSearch.OpenStreetMapProvider();
$(function () {
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
        var healfh = info.health.toLowerCase();
        var lat = info.lat;
        var lng = info.lng;
        var description = info.description;
        var url = info.url;
        var species = info.species.toLowerCase();
        var address = info.address;
        if (healfh == "bad") {
            var redIcon = new L.Icon({
                iconUrl: '../../public/images/marker-icon-2x-red.png',
                shadowUrl: '/public/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                className: id
            });

            marker = L.marker([lat, lng], { icon: redIcon, alt: "strayed " + species + " " + name + " at the " + address});
        }
        else if (healfh == "good") {
            var greenIcon = new L.Icon({
                iconUrl: '../../public/images/marker-icon-2x-green.png',
                shadowUrl: '/public/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                className: id
            });
            marker = L.marker([lat, lng], {icon: greenIcon, alt: "strayed " + species + " " + name + " at the " + address});
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
            marker = L.marker([lat, lng], {icon: normalIcon, alt: "strayed animal " + name + " at the " + address});
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

    var address = $("#address")

    $("#mapSearch").on("submit", (event) => {

        event.preventDefault();
        // console.log("Searched!");
        const addressString = address.val();
        let location = new Array();
        const syncResults = async (address) => {
            const results = await providerOSM.search({ query: address });
            // console.log(results)
            // console.log(results[0])
            // console.log(results[0].y, results[0].x);
            if (results !== undefined && results.length > 0) {
                location.push(Number(results[0].y), Number(results[0].x));
                // console.log(location);
                const requestConfig = {
                    // Set Ajax RequestConfig here
                    method: "GET",
                    url: "/map",
                    data: {
                        location: location
                    }
                }

                $.ajax(requestConfig).then((res) => {
                    // Define how to render response data on page
                    map.setView([location[0], location[1]], 13)
                })
            }
        }
        syncResults(addressString);
        // const requestConfig = {
        
        //     // Set Ajax RequestConfig here
        //     method: "GET",
        //     url: "/map",
        //     data: {
        //         location: location
        //     }
        // }

        // $.ajax(requestConfig).then((res) => {
        //     // Define how to render response data on page
        //     map.setView([51.505, -0.09], 13)
        // })

        })
    

})