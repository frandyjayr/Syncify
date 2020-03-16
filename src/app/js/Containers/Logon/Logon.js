import React, { Component } from 'react';
import {RetrieveAccessToken, ReturnAuthorizeQueryString, RetrieveUserInfo, GetUrlVars} from '../../../api/Spotify/Spotify.js';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Authenticate from '../../Components/Authenticate/Authenticate.js';
import LogonPage from '../../Components/LogonPage/LogonPage.js';
import { connect } from 'react-redux';
import * as actionTypes from '../../Store/Actions/ActionTypes.js';

class Logon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    }
  }

  AccessTokenCallBack = (resp) => {    
      this.SetAuthentication(resp['body']);
  }

  SetAuthentication = (params) => {
    let authStatus = true;
    if (params.includes('error')) {
      authStatus = false;
    } else {
      params = JSON.parse(params);
    }    
    RetrieveUserInfo(params, (data) => {
      let newUser = {
        access_token: params.access_token,
        displayName: data.display_name,
        email: data.email,
        id: data.id,
        type: data.type,
        country: data.country,
        product: data.product
      };
      
      //this.setState({isAuthenticated : authStatus})
      this.props.setAuthentication(authStatus, params, newUser); 
    });    

  }

  SetAuthState = (status) => {
    this.setState({isAuthenticated: status})
  }
  
  componentDidMount = () => {
      let authorizeCode = GetUrlVars()['code'] || null;
      if (authorizeCode) {
        RetrieveAccessToken(authorizeCode, this.AccessTokenCallBack);      
      }
  }

  authenticateUser = () => {
    setTimeout(() => {
      this.props.setUserLogin(true);
      window.location.href = ReturnAuthorizeQueryString();
    }, 1000)
  }

  render() {

    let match  = this.props.match;    
    return (   
        <div>
          <Switch>
            <Route exact path={match.path + '/'}><LogonPage authenticateUser={this.authenticateUser}></LogonPage> </Route>
            <Route exact path={match.path + '/authenticate'}><Authenticate></Authenticate> </Route>     
          </Switch>
        </div>
        
    )
  };
}
  
const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn,
    isAuthenticated: state.isAuthenticated
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthentication: (authStatus, tokenParams, user) => dispatch({ 
      type: actionTypes.SET_AUTHENTICATION, 
      payload : { 
        authStatus: authStatus, 
        tokenParams: {...tokenParams},
        user: {...user}
      }
    }),
    setUserLogin: (loginStatus) => dispatch({ type: actionTypes.SET_LOGIN, payload : { status: loginStatus}})
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Logon));
  