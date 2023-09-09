import http from 'k6/http';
import { check } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 100 },
        { duration: '10s', target: 100 },
        { duration: '5s', target: 0 }, // ramp-down to 0 users
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        iteration_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
    }
};

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Function to convert radians to degrees
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

// Function to generate random points
function generateRandomPoints(sourceLat, sourceLon, distance) {
    const earthRadius = 6371; // Earth's radius in kilometers
    // Generate random angle
    const randomAngle = Math.random() * 2 * Math.PI;

    // Calculate new coordinates
    const deltaLat = (distance / earthRadius) * Math.cos(randomAngle);
    const deltaLon = (distance / earthRadius) * Math.sin(randomAngle) / Math.cos(toRadians(sourceLat));
    const newPointLat = sourceLat + toDegrees(deltaLat);
    const newPointLon = sourceLon + toDegrees(deltaLon);

    return { lat: newPointLat, lon: newPointLon };
}

function generatePairs(sourceLat, sourceLon, distance, numberOfPairs) {
    const pairs = []
    //console.log(randomPoints)
    for (let i = 0; i < numberOfPairs; i++) {
        let randomPoint1 = generateRandomPoints(sourceLat, sourceLon, distance)
        let randomPoint2 = generateRandomPoints(randomPoint1.lat, randomPoint1.lon, distance)
        pairs.push({ lat1: randomPoint1.lat, lon1: randomPoint1.lon, lat2: randomPoint2.lat, lon2: randomPoint2.lon });
    }
    return pairs;
}


const pairs = generatePairs(10.754679709166416, -253.32845628261566, 10, 100);

export default () => {
    const randomIndex = Math.floor(Math.random() * pairs.length);
    const randomPair = pairs[randomIndex];
    let failed = true;
    while (failed) {
        const res = http.get(http.url`https://trihoang0809-ideal-waffle-6pw6496j9gwfr469-8002.app.github.dev/route?json={%22locations%22:[{%22lat%22:${randomPair.lat1},%22lon%22:%20${randomPair.lon1},%22street%22:%22Tran%20Phu%22},{%22lat%22:${randomPair.lat2},%22lon%22:${randomPair.lon2},%22street%22:%22Dinh%20Tien%20Hoang%22}],%22costing%22:%22auto%22,%22costing_options%22:{%22auto%22:{%22country_crossing_penalty%22:2000.0}},%22units%22:%22miles%22,%22id%22:%22my_work_route%22}`);
        if (!res.json().hasOwnProperty('trip')) {           
            // Call Valhalla Locate API
            const locateRes = http.get(`https://valhalla1.openstreetmap.de/locate?json={"verbose":true,"locations":[{"lat":${randomPair.lat1},"lon":${randomPair.lon1}}],"costing":"bicycle","costing_options":{"bicycle":{"bicycle_type":"road"}},"directions_options":{"units":"miles"}}`);
            const locateJson = locateRes.json();
            const nearbyPoint = {lat: locateJson.nodes.lat, lon: locateJson.nodes.lon};            
            const newRes = http.get(http.url`https://trihoang0809-ideal-waffle-6pw6496j9gwfr469-8002.app.github.dev/route?json={%22locations%22:[{%22lat%22:${nearbyPoint.lat1},%22lon%22:%20${nearbyPoint.lon1},%22street%22:%22Tran%20Phu%22},{%22lat%22:${randomPair.lat2},%22lon%22:${randomPair.lon2},%22street%22:%22Dinh%20Tien%20Hoang%22}],%22costing%22:%22auto%22,%22costing_options%22:{%22auto%22:{%22country_crossing_penalty%22:2000.0}},%22units%22:%22miles%22,%22id%22:%22my_work_route%22}`);
            check(newRes, {
                'verify reachability with Valhalla': (newRes) => {
                    if (newRes.json().hasOwnProperty('trip')) {
                        failed = false; // break the loop if 'trip' is found
                }
            });
        } else {
            failed = false; 
        }
    }
}
