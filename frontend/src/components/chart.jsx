import React,{useEffect,useState} from 'react';
import {Bar} from 'react-chartjs-2';

import 'chart.js/auto';
import { Line } from "react-chartjs-2";

import Api from "../helper/api";

const api = new Api();


function getAveragePrices(stations){
    let Gazoile = 0;
    let SP95=0;
    let E85=0;
    let GPlc=0;
    let E10=0;
    let l=0;
    let j=0;
    let k=0;
    let m=0;
    let n=0;
    if( stations!== undefined){
        for(let i=0;i<stations.length;i++){
            if( stations[i].prix!== undefined){
                stations[i].prix.map( p => {
                    if(p.nom.includes("Gazole")){
                        Gazoile+= parseFloat(p.valeur); 
                        l+=1;
                    }else if(p.nom.includes("SP95")){
                        SP95+= parseFloat(p.valeur); 
                        k+=1;
                    }
                    else if(p.nom.includes("E85")){
                        E85+= parseFloat(p.valeur); 
                        j+=1;
                    }
                    else if(p.nom.includes("GPLc")){
                        GPlc+= parseFloat(p.valeur); 
                        m+=1;
                    }else if(p.nom.includes("E10")){
                        E10+= parseFloat(p.valeur); 
                        n+=1;
                    }
                  })
            }
            
        }
    }
    
    Gazoile=Gazoile/l;
    E85=E85/j;
    SP95=SP95/k;
    GPlc=GPlc/m;
    E10=E10/n;
    return [Gazoile,E85,SP95,GPlc,E10]
}



function getGazolePrices(stations){
    let Gazoile = [];
    let dates =[];
    
    if( stations!== undefined){
        for(let i=0;i<stations.length;i++){

            if( stations[i].prix!== undefined){
                stations[i].prix.map( p => {
                    if(p.nom.includes("Gazole")){
                        Gazoile.push(parseFloat(p.valeur));
                        dates.push(p.maj)
                        
                    }
                  })
            }
            }
    }
  
        
    return [Gazoile,dates]
}

function getSP95Prices(stations){
    let Gas = [];
    let dates =[];
    
    if( stations!== undefined){
        for(let i=0;i<stations.length;i++){
            if( stations[i].prix!== undefined){
                stations[i].prix.map( p => {
                    if(p.nom.includes("SP95")){
                        Gas.push(parseFloat(p.valeur));
                        dates.push(p.maj)
                        
                    }
                  })
            }
            
        }
    }
    
    return [Gas,dates]
}

function getE85Prices(stations){
    let Gas = [];
    let dates =[];
    
    if( stations!== undefined){
        for(let i=0;i<stations.length;i++){
            if( stations[i].prix!== undefined){
                stations[i].prix.map( p => {
                    if(p.nom.includes("E85")){
                        Gas.push(parseFloat(p.valeur));
                        dates.push(p.maj)
                        
                    }
                  })
            }
            
        }
    }
    
    return [Gas,dates]
}

function getE10Prices(stations){
    let Gas = [];
    let dates =[];
    
    if( stations!== undefined){
        for(let i=0;i<stations.length;i++){
            if( stations[i].prix!== undefined){
                stations[i].prix.map( p => {
                    if(p.nom.includes("E10")){
                        Gas.push(parseFloat(p.valeur));
                        dates.push(p.maj)
                        
                    }
                  })
            }
            
        }
    }
    
    return [Gas,dates]
}


  
var StationData=[]

export default function BarChart({dataFromParent}) {

    StationData=dataFromParent;
    console.log("Heeeeere",StationData);

    const state = {
        labels: ['Gazoile', 'E85', 'SP95','GPLc','E10'],
        datasets: [
            {
                label: 'Average Gas prices Euro(€)',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: getAveragePrices(StationData)
            }
        ]
    }

    const data = {
        labels:getGazolePrices(StationData)[1],
        datasets: [
          {
            label: "Gaazole",
            data: getGazolePrices(StationData)[0],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          },
          {
            label: "SP95",
            data: getSP95Prices(StationData)[0],
            fill: false,
            borderColor: "#742774"
          },
          {
            label: "E85",
            data: getE85Prices(StationData)[0],
            fill: false,
            borderColor: "#B22222"
          },
          {
            label: "E10",
            data: getE10Prices(StationData)[0],
            fill: false,
            borderColor: "#0000CD"
          }

        ]
      };
    
        getGazolePrices(StationData);
        return (
            <div style={{ maxHeight: "80%", width: '100%',overflow:'scroll',textAlign:'center'}}>
                <Bar
                    data={state}
                    options={{
                        title:{
                            display:true,
                            text:'Average Employee Salary per Month',
                            fontSize:20
                        },
                        legend:{
                            display:true,
                            position:'right'
                        }
                    }}
                />

                <Line data={data} />
            </div>
        );
    
}