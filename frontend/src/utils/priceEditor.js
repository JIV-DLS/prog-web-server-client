import Api from "../helper/api";

const api = new Api()
export function modifyPrice(stationId, carburant,price){

    console.log("Updating station : " + stationId + "(" + carburant + ") : " + price + "...");
    api.updateGasPrice(stationId,{
        "nom": carburant,
        "valeur":""+parseFloat(price)*1000
    }).then((res)=>{
        if(res)alert("Mise à jour suggérée avec succès pour la station " + stationId + ", Prix de carburant mis à jour " + carburant + ") : " + price + ".");
        else alert("Whoops something wrong happened! Please retry later!")
    }).catch((error)=>{
        console.log(error);
        alert("Whoops something wrong happened! Please retry later!")
    })
}

export function getOldPrice(stationId, carburant){
    console.log("Getting old price station : " + stationId + "(" + carburant + ")");
}
