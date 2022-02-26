async function askAdress(search){
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        let A;
        var url = "https://api-adresse.data.gouv.fr/search/?q=" + search + "&limit=5";
        xhr.open("GET",url, true);
        xhr.send();
        xhr.onload = () => {
            A = JSON.parse(xhr.responseText);
            resolve(A);
        }
    });
}

export async function loadFromList() {
    document.getElementById("fromList").innerHTML = "";
    var search = document.getElementById("fromAddress").value.replaceAll(" ", "+");
    var addressList = await askAdress(search);
    await addressList.features.forEach(loadFromDataList);
}

async function loadFromDataList(item){
    var div = document.createElement("OPTION");
    div.setAttribute("value", item.properties.name + ", " + item.properties.postcode + " " + item.properties.city);
    await document.getElementById("fromList").appendChild(div);
    console.log(document.getElementById('fromList'))
}

export async function askOneAdress(search){
    return new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        let A;
        var url = "https://api-adresse.data.gouv.fr/search/?q=" + search;
        console.log(url)
        xhr.open("GET",url, true);
        xhr.send();
        xhr.onload = () => {
            A = JSON.parse(xhr.responseText);
            resolve(A);
        }
    });
}