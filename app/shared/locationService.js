'use strict';

var stops = [{
    name : 'Hill Rise',
    latitude : 51.85552257803778,
    longitude : -1.3617467880249023
}, {
    name : 'Gloucester Green',
    latitude : 51.75400429896277,
    longitude : -1.262478232383728
}];

function getNearestStop(func) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {   
            var lastDist = -1,
                lastStop = null;
            stops.forEach(function(stop) {
                var dist = getDistanceFromLatLonInKm(stop.latitude, stop.longitude, pos.coords.latitude, pos.coords.longitude);
                console.log(stop.name + ': ' + dist);
                if (dist < lastDist || lastDist == -1) {
                    lastDist = dist;
                    lastStop = stop;
                }
            });
            func(lastStop);
        });
    } else {
        throw 'Requires geolocation support';
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
