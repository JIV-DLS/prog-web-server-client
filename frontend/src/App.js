import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import MyMap from './components/myMap';
import SignIn from './components/signIn';
import SignUp from './components/signUp';


export default function App() {

  const mapIsReadyCallback = (map) => {
    console.log(map);
  };

  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/signIn">
            <SignIn />
          </Route>
          <Route path="/signUp">
            <SignUp />
          </Route>
          <Route path="/">
          <MyMap />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}