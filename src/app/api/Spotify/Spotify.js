import axios from 'axios';
var request = require('request');


export const authEndpoint = 'https://accounts.spotify.com/authorize?';

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret =  process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

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

