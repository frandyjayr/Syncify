import * as actionTypes from '../Actions/ActionTypes.js';

const initialState = {
    isLoggedIn: false,
    isAuthenticated: false,
    isPlaying: false,
    currentRoom: null,
    tokenParams: {},
    user: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGOUT_USER: {
            return {
                ...state,
                isLoggedIn: false,
                isAuthenticated: false,
                tokenParams: {},
                user: {},
            }
        }
        case actionTypes.SET_AUTHENTICATION: {
            return {
                ...state,
                isAuthenticated: action.payload.authStatus,
                tokenParams: {...action.payload.tokenParams},
                user: {...action.payload.user}
            }
        } 
        case actionTypes.SET_LOGIN: {
            return {
                ...state,
                isLoggedIn: action.payload.status
            }
        }       
        default: {
            return state
        }


    }
}

export default reducer;