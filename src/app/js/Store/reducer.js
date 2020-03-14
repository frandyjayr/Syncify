const initialState = {
    isLoggedIn: false,
    isAuthenticated: false,
    tokenParams: {},
    user: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGOUT_USER': {
            return {
                ...state,
                isLoggedIn: false,
                isAuthenticated: false,
                tokenParams: {},
                user: {},
            }
        }
        case 'SET_AUTHENTICATION': {
            return {
                ...state,
                isAuthenticated: action.payload.authStatus,
                tokenParams: {...action.payload.tokenParams},
                user: {...action.payload.user}
            }
        } 
        case 'SET_LOGIN': {
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