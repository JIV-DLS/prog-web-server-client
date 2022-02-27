import {askOneAdress} from "./addressLocator";

var openroute_api_key = "5b3ce3597851110001cf624802362b6174e54aa98a8f502fe809cafc";

export async function getItinerary(startXString, startYString, endXString, endYString){
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        let A;
        var url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=" + openroute_api_key + "&start="+startXString+","+startYString+"&end="+endXString+","+endYString;
        console.log("sent request :" + url);
        xhr.open("GET",url, true);
        xhr.send();
        xhr.onload = () => {
            A = JSON.parse(xhr.responseText);
            console.log(A)
            resolve(A);
        }
    });
}

export async function drawItinerary(currentPosition,endXString, endYString) {
    /*lines = [[[45.51, -122.68],[37.77, -122.43]],[[37.77, -122.43],[34.04, -118.2]]];
    return lines;*/
    let startYString = "";
    let startXString = "";
    const givenAddress = document.getElementById("fromAddress").value;
    if (givenAddress && givenAddress.length>3){

        let address = await askOneAdress(givenAddress);
        startYString = address.features[0].geometry.coordinates[1];
        startXString = address.features[0].geometry.coordinates[0];
    }else{
        startYString = currentPosition.coords.latitude;
        startXString = currentPosition.coords.longitude;
    }

    if(startXString === "" || startYString === ""){
        alert("Veuillez entrer une addresse valide ou autoriser le navigateur à acceder à votre position.");
        return [];
    }
    console.log(startYString, startXString, endXString, endYString)
    var itinerary = await getItinerary(startXString, startYString, endXString, endYString)
    var positions = []
    console.log(itinerary.features[0].geometry.coordinates.length)
    for (var i = 1; i < itinerary.features[0].geometry.coordinates.length; i++) {
        positions.push([[itinerary.features[0].geometry.coordinates[i][1],itinerary.features[0].geometry.coordinates[i][0]], [itinerary.features[0].geometry.coordinates[i - 1][1], itinerary.features[0].geometry.coordinates[i - 1][0]]])
    }
    return positions
}

function drawLine(fromX, fromY, toX, toY, color){
    console.log("Drawing [" + fromX+", " + fromY +"] to [" + toX + ", " + toY + "]");
}

