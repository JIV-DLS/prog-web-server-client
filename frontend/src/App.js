import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.scss';
import Header from './components/header';
import SignIn from './components/signIn';
import SignUp from './components/signUp';
import EnhancedTable from './components/table';
import useLocalStorage from './components/useLocalStorage';
import { ToggleModeNight } from './components/theme';
import { useCallback } from 'react';

export default function App() {
  const [storageMode, setStorageMode] = useLocalStorage('darkmode');

  const handleChangeMode = useCallback(
      (e) => {
          const modeValue = !!e.target.checked;
          setStorageMode(modeValue);
      },
      [setStorageMode],
  );

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
          <Route path="/signIn">
            <SignIn />
          </Route>
          <Route path="/signUp">
            <SignUp />
          </Route>
          <Route path="/dataTable">
           <EnhancedTable />
          </Route>
          <Route path="/">
            <Header mode={storageMode}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}