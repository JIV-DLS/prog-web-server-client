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
import EnhancedTable from './components/table';
import useLocalStorage from './components/useLocalStorage';
import { ToggleModeNight } from './components/theme';
import { useCallback } from 'react';
import Api from "./helper/api";

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
  /*const handleUserInfoLoaded = useCallback(
      (userInfos) => {
          setUser(userInfos);
      },
      [setUser],
  );*/


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

  const [post, getPost] = useState([])
  useEffect(() => {
      api.getStations(14590,4319219).then((data)=>{
          console.log("Stations to show",data)
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
           <EnhancedTable />
          </Route>
          <Route path="/chart">
           <BarChart />
          </Route>
          <Route path="/">
            <Header mode={storageMode}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
