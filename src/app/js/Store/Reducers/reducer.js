import * as actionTypes from '../Actions/ActionTypes.js';

const initialState = {
    isLoggedIn: false,
    isAuthenticated: false,
    isPlaying: false,
    player: null,
    tokenParams: {},
    user: {},
    currentSong: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_SONG: {
            return {
                ...state,
                currentSong: {...action.payload.songInfo}
            }
        }
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
        case actionTypes.SET_PLAYER: {
            return {
                ...state,
                player: {...action.payload.player}
            }
        }       
        default: {
            return state
        }


    }
}

export default reducer;