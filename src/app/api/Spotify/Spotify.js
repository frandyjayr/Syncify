import axios from 'axios';
var request = require('request');


export const authEndpoint = 'https://accounts.spotify.com/authorize?';

const clientId = "e1a6860ed0054748985a5975339d8878";
const clientSecret =  "57c5a84e03024d17929d06e74103bfb8";
const redirectUri = "http://localhost:3001/syncify/logon/authenticate";

console.log(process.env);

const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

export function RetrieveAccessToken(token, callback) {
    var form = {
        grant_type: "authorization_code",
        code: token,
        redirect_uri: redirectUri
    }

    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')) 
    }

    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: form,
        headers: headers
    }, function(error, resp) {
        callback(resp);
    }); 
}

export var RetrieveUserInfo = (params, callback) => {
    if ('access_token' in params) {
    axios
      .get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${params.access_token}`
        }
      })
      .then(({ data }) => {
          console.log(data);
          callback(data);
      })
      .catch(err => console.log(err));
  } else {
    window.location = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}&scope=${process.env.REACT_APP_SPOTIFY_SCOPE}&response_type=token`;
  }
}

export function ReturnAuthorizeQueryString() {
    return `${authEndpoint}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;
}

export function GetUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

