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

const api = new Api();

export default function App() {

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
  var ChartStations=[]
  useEffect(() => {
      api.getStations(14590,4319219).then((data)=>{
          //console.log("Stations to show",data)
          //console.log("Statons in APPjs",DataStations
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
              d.pdv_content["services"]  = "non definied"
            }
     
            ChartStations.push(d.pdv_content);}
            
    
          })
          console.log("Chart data",ChartStations);
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
              d.pdv_content["services"]  = "non definied"
            }
            
            if(d.pdv_content.services===undefined){
              d.pdv_content["services"]  = "non definied"
            }
            d.pdv_content.prix=NewPrix;
            let x = parseInt(d.pdv_content.longitude)/100000

            d.pdv_content.longitude=x.toString();

            let y = parseInt(d.pdv_content.latitude)/100000

            d.pdv_content.latitude=y.toString();

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
            <Header mode={storageMode} stations={stationsMap}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
  }
