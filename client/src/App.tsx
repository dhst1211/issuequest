import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Home from './Home';
import Dashboard from './Dashboard'

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route exact path="/dashboard" component={Dashboard} />
    </Router>
  );
}

export default App;
