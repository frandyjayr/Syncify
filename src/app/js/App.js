import React, { Component } from 'react';
import MusicRoomLayout from './Components/MusicRoomLayout/MusicRoomLayout.js';
import MusicRoom from './Containers/MusicRoom/MusicRoom.js';
import Logon from './Containers/Logon/Logon.js';
import { connect } from 'react-redux'

import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { SpotifyApiContext } from 'react-spotify-api';
//const path = require('path');



console.log(process.env.REACT_APP_CLIENT_ID);
console.log(__dirname)
const PrivateRoute = ({ component: Component, ...rest }) => (

  <Route {...rest} render={(props) => (
    //  (rest.location.state !== undefined && rest.location.state.isLoggedIn === true)
      (rest.isLoggedIn && rest.isAuthenticated)
      ? <Component {...props}> <SpotifyApiContext.Provider value={rest.accessToken}><MusicRoom accessToken={rest.accessToken}></MusicRoom></SpotifyApiContext.Provider> </Component>
      : <Redirect to={{ pathname: '/syncify/logon', state: { from: props.location } }}/>
  )} />
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (   


          <Switch>            
            <Route path='/syncify/logon' component={Logon}></Route>         
            <PrivateRoute 
              path='/' 
              component={MusicRoomLayout} 
              isLoggedIn={this.props.isLoggedIn} 
              isAuthenticated={this.props.isAuthenticated} 
              accessToken={this.props.accessToken}>              
            </PrivateRoute>
            <Route path='*'><div>NO MATCH</div></Route>
            
          </Switch>
        
    )
  }    
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    isAuthenticated: state.isAuthenticated,
    accessToken: state.tokenParams.access_token
  }
};

export default withRouter(connect(mapStateToProps)(App));
