import React from 'react';
import { connect } from 'react-redux';
import './Header.css';
import logo from '../../../Public/Resources/Images/logo.png';
import * as actionTypes from '../../Store/Actions/ActionTypes.js';

const Header = (props) => {
    return (
        <div className='Header_header'>            
            <ul>
                <li className='Header_logo'><img href="/#" src={logo} alt=""></img><span>Syncify</span></li>
                <li><a onClick={props.logoutUser}>Sign Out</a></li>
                <li><a href='/syncify/home'>Home</a></li>
                
            </ul>
        </div>
    )
};

const mapDispatchToProps = (dispatch) => {
    return {
      logoutUser: () => dispatch({ 
        type: actionTypes.LOGOUT_USER
      })
    }
  }

export default connect(null, mapDispatchToProps)(Header);