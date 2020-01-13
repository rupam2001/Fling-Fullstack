import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import Login from './components/login.component';
import Homepage from './components/homepage.component';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import myContext from './context/Mycontext';
import Cookies from 'js-cookie';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      islogin: false,
      loaded: true
    }
    this.isloginfunc = this.isloginfunc.bind(this);
  }
  isloginfunc(b) {
    this.setState({
      islogin: b
    })
    console.log(this.state.islogin);
  }
  render() {
    if (this.state.loaded)
      return (
        <div >

          {(!this.state.islogin) ? (
            <div className="TitleBox">
              <div>
                <h1 className='Titlemain'>JEC-Fling</h1>
              </div>
              <Login isloginfunc={this.isloginfunc.bind(this)} />
            </div>

          ) : (

              <Homepage isloginfunc={this.isloginfunc.bind(this)} islogin={this.state.islogin} />

            )}


          {/* <Router>
        <Route path='/' exact component={loginCompofunction} />
        <Route path='/homepage' component={homepageCompofunction} />
      </Router> */}
        </div>
      );
    else
      return <div>Loading...</div>
  }
}

export default App;
