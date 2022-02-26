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

const api = new Api();

export default function App() {

  const [storageMode, setStorageMode] = useLocalStorage('darkmode');
    const [token, setToken] = useLocalStorage('token');

  const handleChangeMode = useCallback(
      (e) => {
          const modeValue = !!e.target.checked;
          setStorageMode(modeValue);
      },
      [setStorageMode],
  );

  const [stationsChart, setStationsChart] = useState([]);
  const [stationsMap, setStationsMap] = useState([]);
  var DataStations=[];
  useEffect(() => {
      api.getStations(14590,4319219).then((data)=>{
          setStationsChart(data);
          data.map( d => {
            var NewPrix=[];
            var NewPrix=[];
            if(d.pdv_content.prix){

              for(let i=0; i<d.pdv_content.prix.length-1;i++){

                let carburant=d.pdv_content.prix[i];

                if(carburant.nom  ){
                  if( carburant.nom !== d.pdv_content.prix[i+1].nom){
                    let temp=carburant.valeur;
                    if(carburant.valeur.length<4)
                      carburant.valeur=temp.slice(0, 0) + "0." + temp.slice(0 + Math.abs(0));
                    else
                      carburant.valeur=temp.slice(0, 1) + "." + temp.slice(1 + Math.abs(0));
                    NewPrix.push(carburant);
                  }

                }

                }
            }

            if(d.pdv_content.services===undefined){
              d.pdv_content["services"]  = "non definied"
            }
            d.pdv_content.prix=NewPrix;
            d.pdv_content.latitude=d.pdv_content.latitude.slice(0, 2) + "." + d.pdv_content.latitude.slice(2 + Math.abs(0));
            d.pdv_content.longitude=d.pdv_content.longitude.slice(0, 1) + "." + d.pdv_content.longitude.slice(1 + Math.abs(0));
            DataStations.push(d.pdv_content);


          })

          console.log("New data",DataStations);
          setStationsMap(DataStations);

      })
  }, [])

  return (
    <Router>
      <div className={`App ${storageMode ? 'dark' : 'light'}`}>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
         <div class="Toggle">
           <ToggleModeNight
						onChange={handleChangeMode}
						mode={storageMode}
					 />
         </div>
        <Switch>
          <Route path="/signIn" >
            <SignIn setUser={setToken}/>
          </Route>
          <Route path="/signUp" >
            <SignUp setUser={setToken}/>
          </Route>
          <Route path="/dataTable">
           <CollapsibleTable parentToChild = {stationsMap}/>
          </Route>
          <Route path="/chart">
           <BarChart dataFromParent = {DataStations}/>
          </Route>
          <Route path="/">
            <Header mode={storageMode} stations={stationsMap} token={token}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
