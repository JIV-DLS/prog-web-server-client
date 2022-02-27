import Api from "../helper/api";

const api = new Api()

function updatePrice(stationId, carburant,price){
    console.log("Updating station : " + stationId + "(" + carburant + ") : " + price + "...");
    api.updateGasPrice(stationId,{
        "nom": carburant,
        "valeur":""+parseFloat(price)
    }).then((res)=>{
        if(res)alert("Mise à jour suggérée avec succès pour la station " + stationId + ", Prix de carburant mis à jour " + carburant + ") : " + price + ".");
        else alert("Whoops something wrong happened! Please retry later!")
    }).catch((error)=>{
        console.log(error);
        alert("Whoops something wrong happened! Please retry later!")
    })
}

export function modifyPrice(stationId, carburant,price){
    updatePrice(stationId, carburant,price);
}

export function getOldPrice(stationId, carburant,price){
    //updatePrice(stationId, carburant,price);
}
