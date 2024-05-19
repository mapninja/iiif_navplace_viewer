let viewer;
let map;
let geoJsonLayer;
// Add the following code to display the map by default
displayMap();
async function loadManifest() {
    const url = document.getElementById('iiif-url').value;
    document.getElementById('console').innerText = '';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch the manifest');

        const manifest = await response.json();
        clearPreviousDisplay();
        displayIIIF(manifest);
        displayMetadata(manifest);
        if (manifest.navPlace) {
            displayMap(manifest.navPlace);
        }
    } catch (error) {
        document.getElementById('console').innerText = `Error: ${error.message}`;
    }
}

function clearPreviousDisplay() {
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }
    if (map) {
        map.remove();
        map = null;
        document.getElementById('map').innerHTML = '<div id="map" class="map"></div>';
    }
    document.getElementById('metadata').innerText = '';
}

function displayIIIF(manifest) {
    const tileSource = manifest.sequences ? manifest.sequences[0].canvases[0].images[0].resource.service['@id'] + '/info.json' : manifest.items[0].items[0].items[0].body.id + '/info.json';
    viewer = OpenSeadragon({
        id: 'openseadragon1',
        prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
        tileSources: [tileSource],
        preserveViewport: true,
        visibilityRatio: 1,
        minZoomLevel: 1,
        defaultZoomLevel: 1,
    });
}

function displayMetadata(manifest) {
    const metadataDiv = document.getElementById('metadata');
    const metadata = manifest.metadata || [];
    metadata.forEach(item => {
        const p = document.createElement('p');
        p.innerText = `${item.label}: ${item.value}`;
        metadataDiv.appendChild(p);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    displayMap();
});

async function loadManifest() {
    const url = document.getElementById('iiif-url').value;
    document.getElementById('console').innerText = '';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch the manifest');
        const manifest = await response.json();
        clearPreviousDisplay();
        displayIIIF(manifest);
        displayMetadata(manifest);
        if (manifest.navPlace) {
            displayMap(manifest.navPlace);
        }
    } catch (error) {
        document.getElementById('console').innerText = `Error: ${error.message}`;
    }
}

function displayMap(navPlace) {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    if (navPlace) {
        geoJsonLayer = L.geoJson(navPlace).addTo(map);
        map.fitBounds(geoJsonLayer.getBounds());
    }
}

// Add the following code to display the map by default
displayMap();
