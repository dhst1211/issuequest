import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {
  Link
} from "react-router-dom";

import './Home.scss';

const GITHUB_LOGIN_URL: string = (process.env.NODE_ENV === "development") ? `${process.env.REACT_APP_SERVER_LOCATION}/auth/github` : "/auth/github"

function Home() {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/check')
      .then(res => {
        setIsAuthed(res.data.authenticated);
      })
      .catch((error) => {
        setIsAuthed(false)
    });
  }, []);

  return (
    <section className="hero is-success is-fullheight is-bold">
      <div className="hero-head">
        <header className="navbar">
          <div className="container">
            <div className="navbar-brand">
              <a className="navbar-item" href="">
                <h1>IssueQuest</h1>
              </a>
              <span className="navbar-burger burger" data-target="navbarMenuHeroC">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenuHeroC" className="navbar-menu">
              <div className="navbar-end">
                <span className="navbar-item">
                  <a className="button is-success is-inverted" href="https://github.com/dhst1211/issuequest">
                    <span className="icon">
                      <i className="fab fa-github"></i>
                    </span>
                    <span>Code</span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title">
            Find new issues
          </h1>
          {isAuthed ? (
            <Link to="/dashboard" className="button is-warning is-rounded">
              Go Dashboard
            </Link>
          ) : (
            <a href={GITHUB_LOGIN_URL} className="button login-button">
              <span className="icon">
                <i className="fab fa-github"></i>
              </span>
              <span>Sign in with Github</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default Home;