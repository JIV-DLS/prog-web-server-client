import {askOneAdress} from "./addressLocator";

var openroute_api_key = "5b3ce3597851110001cf624802362b6174e54aa98a8f502fe809cafc";

export async function getItinerary(startXString, startYString, endXString, endYString) {
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        let A;
        var url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + openroute_api_key + "&start=" + startXString + "," + startYString + "&end=" + endXString + "," + endYString;
        console.log("sent request :" + url);
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onload = () => {
            A = JSON.parse(xhr.responseText);
            console.log(A)
            resolve(A);
        }
    });
}

export function testmethod(param1, param2, param3, param4) {
    console.log('received request');
    console.log('param1 : ' + param1 + 'param2 : ' + param2 + 'param3 : ' + param3 + 'param4 : ' + param4);
}

export function testmethod2() {
    console.log('received request2');
}


export function testmethod3(param1) {
    console.log('received request');
    console.log('param1 : ' + param1);
}

export async function drawItinerary(endXString, endYString) {

    var address = await askOneAdress(document.getElementById("fromAddress"));
    var startYString = address.features[0].geometry.coordinates[1];
    var startXString = address.features[0].geometry.coordinates[0];
    if (startXString === "" || startYString === "") {
        alert("Please enter a valid input");
        return;
    }


    var itinerary = await getItinerary(startXString, startYString, endXString, endYString)
    for (var i = 1; i < itinerary.features[0].geometry.coordinates.length; i++) {
        drawLine(itinerary.features[0].geometry.coordinates[i][1], itinerary.features[0].geometry.coordinates[i][0], itinerary.features[0].geometry.coordinates[i - 1][1], itinerary.features[0].geometry.coordinates[i - 1][0], '#6f79c9');
    }
}

function drawLine(fromX, fromY, toX, toY, color) {
    console.log("Drawing [" + fromX + ", " + fromY + "] to [" + toX + ", " + toY + "]");
}

