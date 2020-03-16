import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const Authenticate = (props) => {

    if (!props.isAuthenticated) {
        return (
            <div>
            <div>Logging In...</div>
            </div>
        )
    } else {
        return (
            <div>
            <div>Authentication Success...</div>           
            <Redirect  to='/'></Redirect>
        </div>)
        
    }
};

const mapStateToProps = (state) => {
    return {
      isLoggedIn: state.isLoggedIn,
      isAuthenticated: state.isAuthenticated
    }
};

export default withRouter(connect(mapStateToProps)(Authenticate));