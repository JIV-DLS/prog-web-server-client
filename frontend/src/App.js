import React, {useState,useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.scss';
import BarChart from './components/chart';
import Header from './components/header';
import SignIn from './components/signIn';
import SignUp from './components/signUp';
import CollapsibleTable from './components/table';
import useLocalStorage from './components/useLocalStorage';
import { ToggleModeNight } from './components/theme';
import { useCallback } from 'react';
import Api from "./helper/api";
import MyHeader from './components/myHeader';
import MyMap from './components/myMap';
import { ConstructionOutlined } from '@mui/icons-material';

const api = new Api();
let previousCenter=null;

function getLocation(callBack) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callBack);
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}

function calcCrow(lat1, lon1, lat2, lon2) 
    {
      console.log("lat1",lat1);
      console.log("lon1",lon1);
      console.log("lat2",lat2);
      console.log("lon2",lon2);
      var R = 6371; 
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }



export default function App() {

  const [currentPosition, setCurrentPosition] = useState();

  getLocation(setCurrentPosition);
  
  const [center, setCenter] = useState([null, null]);

  if(currentPosition!== undefined){
    if((center[0]==null &&center[1]==null)||(!center[0] && !center[1]) ){
      setCenter([currentPosition.coords.latitude,currentPosition.coords.longitude]);
    }
  }



  const handleChange = (center) => {
    setCenter([center["lat"],center["lng"]]);
  };


  const [storageMode, setStorageMode] = useLocalStorage('darkmode');

  const handleChangeMode = useCallback(
      (e) => {
          const modeValue = !!e.target.checked;
          setStorageMode(modeValue);
      },
      [setStorageMode],
  );


    const token = localStorage.getItem("token")
    let userSaved = localStorage.getItem("user")
    if (userSaved) userSaved = JSON.parse(userSaved)

    let tmpUser = null;
  if (token){
      console.log("yes there is a token")
      if(!userSaved){
          api.getUserInfo().then((_user)=> {
              localStorage.setItem("user",JSON.stringify(_user))

              setUser(_user);
          });
      }else {
          if(tmpUser!==userSaved){
              tmpUser = userSaved
          }
      }

  }
  else{
      console.log("nop there is any token!")
  }

  const [user, setUser] = useState(tmpUser);

  const [stationsChart, setStationsChart] = useState([]);
  const [stationsMap, setStationsMap] = useState([]);
  var DataStationsChart=[];
  var DataStations=[];
  var ChartStations=[];

  

    let distance =0;
    

    if(center[0]!==NaN &&center[1]!==NaN  && previousCenter!==null ){
      console.log("TTTT",previousCenter[0],previousCenter[1],center[0],center[1])

      distance=calcCrow(previousCenter[0],previousCenter[1],center[0],center[1]);
      console.log(distance);
    } 
    previousCenter=center;
    if(  distance>0.03){
    


    api.getStations(parseInt(center[1]*100000),parseInt(center[0]*100000)).then((data)=>{
      
      DataStationsChart =[...data];


      DataStationsChart.map( d => {
    
        if(!d.pdv_content.latitude.includes(".") ){
        if(d.pdv_content.prix){

            for(let i=0; i<d.pdv_content.prix.length;i++){
              
              let carburant=d.pdv_content.prix[i];

              if(carburant.nom){
                  let temp=carburant.valeur;
                  if(carburant.valeur.length<4)
                    carburant.valeur=temp.slice(0, 0) + "0" + temp.slice(0 + Math.abs(0));
                  else 
                    carburant.valeur=temp.slice(0, 1) + "" + temp.slice(1 + Math.abs(0));  
              }

              }
        }
        
        if(d.pdv_content.services===undefined){
          d.pdv_content["services"]  = {service:["Aucun serivce"]};
        }
 
        ChartStations.push(d.pdv_content);}
        

      })
      setStationsChart(ChartStations);
      
      data.map( d => {
        var NewPrix=[];
        if(!d.pdv_content.latitude.includes(".") ){
        if(d.pdv_content.prix){
          
          for(let i=0; i<d.pdv_content.prix.length-1;i++){
          
            let carburant=d.pdv_content.prix[i];

            if(carburant.nom  ){
              if( carburant.nom !== d.pdv_content.prix[i+1].nom){
                let temp=carburant.valeur;
                if(carburant.valeur.length<4)
                  carburant.valeur=temp.slice(0, 0) + "0" + temp.slice(0 + Math.abs(0));
                else 
                  carburant.valeur=temp.slice(0, 1) + "" + temp.slice(1 + Math.abs(0));
                NewPrix.push(carburant);
              }
                
            }

            }

            }
        }

        if(d.pdv_content.services===undefined){
          d.pdv_content["services"]  = {service:["Aucun serivce"]};
        }
        
        
        d.pdv_content.prix=NewPrix;
        let x = parseInt(d.pdv_content.longitude)/100000

        d.pdv_content.longitude=x.toString();

        let y = parseInt(d.pdv_content.latitude)/100000

        d.pdv_content.latitude=y.toString();

        DataStations.push(d.pdv_content);

      })
      setStationsMap(DataStations);
    })
  }
    
  

  return (
    <Router>
      <div className={`App ${storageMode ? 'dark' : 'light'}`}>
         <div class="Toggle">
           <ToggleModeNight
						onChange={handleChangeMode}
						mode={storageMode}
					 />
         </div>
        <Switch>
          <Route path="/signIn" >
            <SignIn setUser={setUser}/>
          </Route>
          <Route path="/signUp" >
            <SignUp setUser={setUser}/>
          </Route>
          <Route path="/dataTable">
            <MyHeader mode={storageMode} />
           <CollapsibleTable parentToChild = {stationsMap}/>
          </Route>
          <Route path="/chart">
          <MyHeader mode={storageMode} />
           <BarChart dataFromParent = {stationsChart}/>
          </Route>
          <Route path="/">
            <Header mode={storageMode} stations={stationsMap} onChange={handleChange}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
  }
