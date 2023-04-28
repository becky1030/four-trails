mapboxgl.accessToken = 'pk.eyJ1IjoiYmVja3l5eXl5IiwiYSI6ImNsZWV2azM0bTBiN2k0NG12cnEybml0am0ifQ.pTk0bhJgKynBeJMf1r8N3A';


// topleftmap
// 3. Inca Trail, Peru
// Best hike for modern-day explorers
// Distance: 20 miles (33km) round trip
// Duration: 4-5 days
// Level: moderate
(async () => {
    const topleftmap = new mapboxgl.Map({
        container: 'topleftmap',
        zoom: 12,
        center: [-72.5321352325657, -13.206251914598985],
        pitch: 45,
        bearing: 110,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        interactive: false,
        hash: false
    });

    // Start downloading the route data, and wait for map load to occur in parallel
    const [pinRouteGeojson] = await Promise.all([
        fetch(
            './trail.geojson'
        ).then((response) => response.json()),
        topleftmap.once('style.load')
    ]);

    // Set custom fog
    topleftmap.setFog({
        'range': [-0.5, 2],
        'color': '#def',
        'high-color': '#def',
        'space-color': '#def'
    });

    // Add terrain source, with slight exaggeration
    topleftmap.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.terrain-rgb',
        'tileSize': 512,
        'maxzoom': 14
    });
    topleftmap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    const pinRoute = pinRouteGeojson.features[0].geometry.coordinates;
    // Create the marker and popup that will display the elevation queries
    const popup = new mapboxgl.Popup({ closeButton: false });
    const marker = new mapboxgl.Marker({
        color: 'red',
        scale: 0.8,
        draggable: false,
        pitchAlignment: 'auto',
        rotationAlignment: 'auto'
    })
        .setLngLat(pinRoute[0])
        .setPopup(popup)
        .addTo(topleftmap)
        .togglePopup();

    // Add a line feature and layer. This feature will get updated as we progress the animation
    topleftmap.addSource('line', {
        type: 'geojson',
        // Line metrics is required to use the 'line-progress' property
        lineMetrics: true,
        data: pinRouteGeojson
    });
    topleftmap.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
            'line-color': 'rgba(0,0,0,0)',
            'line-width': 5
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });

    await topleftmap.once('idle');
    // The total animation duration, in milliseconds
    const animationDuration = 20000;
    // Use the https://turfjs.org/ library to calculate line distances and
    // sample the line at a given percentage with the turf.along function.
    const path = turf.lineString(pinRoute);
    // Get the total line distance
    const pathDistance = turf.lineDistance(path);
    let start;
    function frame(time) {
        if (!start) start = time;
        const animationPhase = (time - start) / animationDuration;
        if (animationPhase > 1) {
            return;
        }

        // Get the new latitude and longitude by sampling along the path
        const alongPath = turf.along(path, pathDistance * animationPhase)
            .geometry.coordinates;
        const lngLat = {
            lng: alongPath[0],
            lat: alongPath[1]
        };

        // Sample the terrain elevation. We round to an integer value to
        // prevent showing a lot of digits during the animation
        const elevation = Math.floor(
            // Do not use terrain exaggeration to get actual meter values
            topleftmap.queryTerrainElevation(lngLat, { exaggerated: false })
        );

        // Update the popup altitude value and marker location
        popup.setHTML('Altitude: ' + elevation + 'm<br/>');
        marker.setLngLat(lngLat);

        // Reduce the visible length of the line by using a line-gradient to cutoff the line
        // animationPhase is a value between 0 and 1 that reprents the progress of the animation
        topleftmap.setPaintProperty('line', 'line-gradient', [
            'step',
            ['line-progress'],
            'red',
            animationPhase,
            'rgba(255, 0, 0, 0)'
        ]);

        // Rotate the camera at a slightly lower speed to give some parallax effect in the background
        const rotation = 150 - animationPhase * 40.0;
        topleftmap.setBearing(rotation % 360);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
})();





// toprightmap
// Everest Base Camp, Nepal
// Best trek for: would-be mountaineers
// Distance: 80 miles (130km) round trip
// Duration: 2 weeks
// Level: moderate
(async () => {
    const toprightmap = new mapboxgl.Map({
        container: 'toprightmap',
        zoom: 11,
        center: [86.71689723158589, 27.904485165948003],
        pitch: 40,
        bearing: 100,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        interactive: false,
        hash: false
    });

    // Start downloading the route data, and wait for map load to occur in parallel
    const [pinRouteGeojson1] = await Promise.all([
        fetch(
            './nepal.geojson'
        ).then((response) => response.json()),
        toprightmap.once('style.load')
    ]);

    // Set custom fog
    toprightmap.setFog({
        'range': [-0.5, 2],
        'color': '#def',
        'high-color': '#def',
        'space-color': '#def'
    });

    // Add terrain source, with slight exaggeration
    toprightmap.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.terrain-rgb',
        'tileSize': 512,
        'maxzoom': 14
    });
    toprightmap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    const pinRoute1 = pinRouteGeojson1.features[0].geometry.coordinates;
    // Create the marker and popup that will display the elevation queries
    const popup1 = new mapboxgl.Popup({ closeButton: false });
    const marker1 = new mapboxgl.Marker({
        color: 'red',
        scale: 0.8,
        draggable: false,
        pitchAlignment: 'auto',
        rotationAlignment: 'auto'
    })
        .setLngLat(pinRoute1[0])
        .setPopup(popup1)
        .addTo(toprightmap)
        .togglePopup();

    // Add a line feature and layer. This feature will get updated as we progress the animation
    toprightmap.addSource('line', {
        type: 'geojson',
        // Line metrics is required to use the 'line-progress' property
        lineMetrics: true,
        data: pinRouteGeojson1
    });
    toprightmap.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
            'line-color': 'rgba(0,0,0,0)',
            'line-width': 5
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });

    await toprightmap.once('idle');
    // The total animation duration, in milliseconds
    const animationDuration1 = 20000;
    // Use the https://turfjs.org/ library to calculate line distances and
    // sample the line at a given percentage with the turf.along function.
    const path1 = turf.lineString(pinRoute1);
    // Get the total line distance
    const pathDistance1 = turf.lineDistance(path1);
    let start;
    function frame(time) {
        if (!start) start = time;
        const animationPhase1 = (time - start) / animationDuration1;
        if (animationPhase1 > 1) {
            return;
        }

        // Get the new latitude and longitude by sampling along the path
        const alongPath1 = turf.along(path1, pathDistance1 * animationPhase1)
            .geometry.coordinates;
        const lngLat1 = {
            lng: alongPath1[0],
            lat: alongPath1[1]
        };

        // Sample the terrain elevation. We round to an integer value to
        // prevent showing a lot of digits during the animation
        const elevation1 = Math.floor(
            // Do not use terrain exaggeration to get actual meter values
            toprightmap.queryTerrainElevation(lngLat1, { exaggerated: false })
        );

        // Update the popup altitude value and marker location
        popup1.setHTML('Altitude: ' + elevation1 + 'm<br/>');
        marker1.setLngLat(lngLat1);

        // Reduce the visible length of the line by using a line-gradient to cutoff the line
        // animationPhase is a value between 0 and 1 that reprents the progress of the animation
        toprightmap.setPaintProperty('line', 'line-gradient', [
            'step',
            ['line-progress'],
            'red',
            animationPhase1,
            'rgba(255, 0, 0, 0)'
        ]);

        // Rotate the camera at a slightly lower speed to give some parallax effect in the background
        const rotation1 = 150 - animationPhase1 * 40.0;
        toprightmap.setBearing(rotation1 % 360);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
})();










// bottomleftmap
// 2. GR20, Corsica, France
// Best trek for: people who love challenges
// Distance:104 miles (168km) round trip
// Duration: 15 days
// Level: difficult
(async () => {
    const bottomleftmap = new mapboxgl.Map({
        container: 'bottomleftmap',
        zoom: 8,
        center: [8.931827796126196, 42.07629366002107],
        pitch: 15,
        bearing: 200,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        interactive: false,
        hash: false
    });

    // Start downloading the route data, and wait for map load to occur in parallel
    const [pinRouteGeojson2] = await Promise.all([
        fetch(
            './france.geojson'
        ).then((response) => response.json()),
        bottomleftmap.once('style.load')
    ]);

    // Set custom fog
    bottomleftmap.setFog({
        'range': [-0.5, 2],
        'color': '#def',
        'high-color': '#def',
        'space-color': '#def'
    });

    // Add terrain source, with slight exaggeration
    bottomleftmap.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.terrain-rgb',
        'tileSize': 512,
        'maxzoom': 14
    });
    bottomleftmap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    const pinRoute2 = pinRouteGeojson2.features[0].geometry.coordinates;
    // Create the marker and popup that will display the elevation queries
    const popup2 = new mapboxgl.Popup({ closeButton: false });
    const marker2 = new mapboxgl.Marker({
        color: 'red',
        scale: 0.8,
        draggable: false,
        pitchAlignment: 'auto',
        rotationAlignment: 'auto'
    })
        .setLngLat(pinRoute2[0])
        .setPopup(popup2)
        .addTo(bottomleftmap)
        .togglePopup();

    // Add a line feature and layer. This feature will get updated as we progress the animation
    bottomleftmap.addSource('line', {
        type: 'geojson',
        // Line metrics is required to use the 'line-progress' property
        lineMetrics: true,
        data: pinRouteGeojson2
    });
    bottomleftmap.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
            'line-color': 'rgba(0,0,0,0)',
            'line-width': 5
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });

    await bottomleftmap.once('idle');
    // The total animation duration, in milliseconds
    const animationDuration2 = 20000;
    // Use the https://turfjs.org/ library to calculate line distances and
    // sample the line at a given percentage with the turf.along function.
    const path2 = turf.lineString(pinRoute2);
    // Get the total line distance
    const pathDistance2 = turf.lineDistance(path2);
    let start;
    function frame(time) {
        if (!start) start = time;
        const animationPhase2 = (time - start) / animationDuration2;
        if (animationPhase2 > 1) {
            return;
        }

        // Get the new latitude and longitude by sampling along the path
        const alongPath2 = turf.along(path2, pathDistance2 * animationPhase2)
            .geometry.coordinates;
        const lngLat2 = {
            lng: alongPath2[0],
            lat: alongPath2[1]
        };

        // Sample the terrain elevation. We round to an integer value to
        // prevent showing a lot of digits during the animation
        const elevation2 = Math.floor(
            // Do not use terrain exaggeration to get actual meter values
            bottomleftmap.queryTerrainElevation(lngLat2, { exaggerated: false })
        );

        // Update the popup altitude value and marker location
        popup2.setHTML('Altitude: ' + elevation2 + 'm<br/>');
        marker2.setLngLat(lngLat2);

        // Reduce the visible length of the line by using a line-gradient to cutoff the line
        // animationPhase is a value between 0 and 1 that reprents the progress of the animation
        bottomleftmap.setPaintProperty('line', 'line-gradient', [
            'step',
            ['line-progress'],
            'red',
            animationPhase2,
            'rgba(255, 0, 0, 0)'
        ]);

        // Rotate the camera at a slightly lower speed to give some parallax effect in the background
        const rotation2 = 150 - animationPhase2 * 40.0;
        bottomleftmap.setBearing(rotation2 % 360);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
})();








// bottomrightmap
// 4. Kilimanjaro, Tanzania
// Best trek for: snow in the tropics
// Distance: 23–56 miles (37-90km)
// Duration: 5–9 days
// Level: moderate
(async () => {
    const bottomrightmap = new mapboxgl.Map({
        container: 'bottomrightmap',
        zoom: 11,
        center: [37.35570362727296,
            -3.063518597410578],
        pitch: 50,
        bearing: 200,
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        interactive: false,
        hash: false
    });

    // Start downloading the route data, and wait for map load to occur in parallel
    const [pinRouteGeojson3] = await Promise.all([
        fetch(
            './tan.geojson'
        ).then((response) => response.json()),
        bottomrightmap.once('style.load')
    ]);

    // Set custom fog
    bottomrightmap.setFog({
        'range': [-0.5, 2],
        'color': '#def',
        'high-color': '#def',
        'space-color': '#def'
    });

    // Add terrain source, with slight exaggeration
    bottomrightmap.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.terrain-rgb',
        'tileSize': 512,
        'maxzoom': 14
    });
    bottomrightmap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    const pinRoute3 = pinRouteGeojson3.features[0].geometry.coordinates;
    // Create the marker and popup that will display the elevation queries
    const popup3 = new mapboxgl.Popup({ closeButton: false });
    const marker3 = new mapboxgl.Marker({
        color: 'red',
        scale: 0.8,
        draggable: false,
        pitchAlignment: 'auto',
        rotationAlignment: 'auto'
    })
        .setLngLat(pinRoute3[0])
        .setPopup(popup3)
        .addTo(bottomrightmap)
        .togglePopup();

    // Add a line feature and layer. This feature will get updated as we progress the animation
    bottomrightmap.addSource('line', {
        type: 'geojson',
        // Line metrics is required to use the 'line-progress' property
        lineMetrics: true,
        data: pinRouteGeojson3
    });
    bottomrightmap.addLayer({
        type: 'line',
        source: 'line',
        id: 'line',
        paint: {
            'line-color': 'rgba(0,0,0,0)',
            'line-width': 5
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });

    await bottomrightmap.once('idle');
    // The total animation duration, in milliseconds
    const animationDuration3 = 20000;
    // Use the https://turfjs.org/ library to calculate line distances and
    // sample the line at a given percentage with the turf.along function.
    const path3 = turf.lineString(pinRoute3);
    // Get the total line distance
    const pathDistance3 = turf.lineDistance(path3);
    let start;
    function frame(time) {
        if (!start) start = time;
        const animationPhase3 = (time - start) / animationDuration3;
        if (animationPhase3 > 1) {
            return;
        }

        // Get the new latitude and longitude by sampling along the path
        const alongPath3 = turf.along(path3, pathDistance3 * animationPhase3)
            .geometry.coordinates;
        const lngLat3 = {
            lng: alongPath3[0],
            lat: alongPath3[1]
        };

        // Sample the terrain elevation. We round to an integer value to
        // prevent showing a lot of digits during the animation
        const elevation3 = Math.floor(
            // Do not use terrain exaggeration to get actual meter values
            bottomrightmap.queryTerrainElevation(lngLat3, { exaggerated: false })
        );

        // Update the popup altitude value and marker location
        popup3.setHTML('Altitude: ' + elevation3 + 'm<br/>');
        marker3.setLngLat(lngLat3);

        // Reduce the visible length of the line by using a line-gradient to cutoff the line
        // animationPhase is a value between 0 and 1 that reprents the progress of the animation
        bottomrightmap.setPaintProperty('line', 'line-gradient', [
            'step',
            ['line-progress'],
            'red',
            animationPhase3,
            'rgba(255, 0, 0, 0)'
        ]);

        // Rotate the camera at a slightly lower speed to give some parallax effect in the background
        const rotation3 = 150 - animationPhase3 * 40.0;
        bottomrightmap.setBearing(rotation3 % 360);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
})();



