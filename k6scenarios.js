import http from 'k6/http';
import { check } from 'k6';

export const options = {
    scenarios: {
        scenario_1: {
            executor: "per-vu-iterations",
            vus: 10,
            iterations: 100,
            exec: 'scen_1',
            startTime: "0s",
        },
        scenario_2: {
            executor: "per-vu-iterations",
            vus: 10,
            iterations: 100,
            exec: 'scen_2',
            startTime: "15s",
        },
        scenario_3: {
            executor: "per-vu-iterations",
            vus: 10,
            iterations: 100,
            exec: 'scen_3',
            startTime: "30s",
        },
    },
};

export function scen_1() {
    let pairs = generatePairs(10.754679709166416, -253.32845628261566, 5, 1000);
    const randomIndex = Math.floor(Math.random() * pairs.length);
    const randomPair = pairs[randomIndex];
    const res = http.get(http.url`https://trihoang0809-ideal-waffle-6pw6496j9gwfr469-8002.app.github.dev/route?json={%22locations%22:[{%22lat%22:${randomPair.lat1},%22lon%22:%20${randomPair.lon1},%22street%22:%22Tran%20Phu%22},{%22lat%22:${randomPair.lat2},%22lon%22:${randomPair.lon2},%22street%22:%22Dinh%20Tien%20Hoang%22}],%22costing%22:%22auto%22,%22costing_options%22:{%22auto%22:{%22country_crossing_penalty%22:2000.0}},%22units%22:%22miles%22,%22id%22:%22my_work_route%22}`);
    check(res, {
        'verify reachability': (res) => {
            if (!res.json().hasOwnProperty('trip')) {
                console.log(`Cannot find a path between (${randomPair.lat1}, ${randomPair.lon1}) and (${randomPair.lat2}, ${randomPair.lon2})`);
                return false;
            }
            return true;
        },
    });
}

export function scen_2() {
    let pairs = generatePairs(10.754679709166416, -253.32845628261566, 10, 1000);
    const randomIndex = Math.floor(Math.random() * pairs.length);
    const randomPair = pairs[randomIndex];
    const res = http.get(http.url`https://trihoang0809-ideal-waffle-6pw6496j9gwfr469-8002.app.github.dev/route?json={%22locations%22:[{%22lat%22:${randomPair.lat1},%22lon%22:%20${randomPair.lon1},%22street%22:%22Tran%20Phu%22},{%22lat%22:${randomPair.lat2},%22lon%22:${randomPair.lon2},%22street%22:%22Dinh%20Tien%20Hoang%22}],%22costing%22:%22auto%22,%22costing_options%22:{%22auto%22:{%22country_crossing_penalty%22:2000.0}},%22units%22:%22miles%22,%22id%22:%22my_work_route%22}`);
    check(res, {
        'verify reachability': (res) => {
            if (!res.json().hasOwnProperty('trip')) {
                console.log(`Cannot find a path between (${randomPair.lat1}, ${randomPair.lon1}) and (${randomPair.lat2}, ${randomPair.lon2})`);
                return false;
            }
            return true;
        },
    });
}

export function scen_3() {
    let pairs = generatePairs(10.754679709166416, -253.32845628261566, 20, 1000);
    const randomIndex = Math.floor(Math.random() * pairs.length);
    const randomPair = pairs[randomIndex];
    const res = http.get(http.url`https://trihoang0809-ideal-waffle-6pw6496j9gwfr469-8002.app.github.dev/route?json={%22locations%22:[{%22lat%22:${randomPair.lat1},%22lon%22:%20${randomPair.lon1},%22street%22:%22Tran%20Phu%22},{%22lat%22:${randomPair.lat2},%22lon%22:${randomPair.lon2},%22street%22:%22Dinh%20Tien%20Hoang%22}],%22costing%22:%22auto%22,%22costing_options%22:{%22auto%22:{%22country_crossing_penalty%22:2000.0}},%22units%22:%22miles%22,%22id%22:%22my_work_route%22}`);
    check(res, {
        'verify reachability': (res) => {
            if (!res.json().hasOwnProperty('trip')) {
                console.log(`Cannot find a path between (${randomPair.lat1}, ${randomPair.lon1}) and (${randomPair.lat2}, ${randomPair.lon2})`);
                return false;
            }
            return true;
        },
    });
}


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

function generatePairs(sourceLat, sourceLon, distance, numPairs) {
    const pairs = []
    //console.log(randomPoints)
    for (let i = 0; i < numPairs; i++) {
        let randomPoint1 = generateRandomPoints(sourceLat, sourceLon, distance)
        let randomPoint2 = generateRandomPoints(randomPoint1.lat, randomPoint1.lon, distance)
        pairs.push({ lat1: randomPoint1.lat, lon1: randomPoint1.lon, lat2: randomPoint2.lat, lon2: randomPoint2.lon });
    }
    return pairs;
}
