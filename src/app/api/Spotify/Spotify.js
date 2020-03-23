import axios from 'axios';
var request = require('request');


export const authEndpoint = 'https://accounts.spotify.com/authorize?';

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret =  process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-read",
  "user-library-modify",

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

export const RetrieveUserInfo = (params, callback) => {
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

export const changeSong = ({
  position_ms,
  spotify_uri,
  playerInstance: {
    _options: {
      getOAuthToken,
      id
    }
  }}, callback) => {
  getOAuthToken(access_token => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotify_uri], position_ms: position_ms }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    }).then((function() {
      callback();
    }));
  });
};

export const pauseSong = ({
  playerInstance: {
    _options: {
      getOAuthToken,
      id
    }
  }
}) => {
  getOAuthToken(access_token => {
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
    });
  });
};

export const transferPlaybackHere = (state, accessToken, CheckChangePositionCallBack) => {
  // ONLY FOR PREMIUM USERS - transfer the playback automatically to the web app.
  // for normal users they have to go in the spotify app/website and change the device manually
  // user type is stored in redux state => this.props.user.type
  const { deviceId } = state;
  fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      device_ids: [deviceId],
      play: false
    })
  })
    .then(res => {
      //logger.log('status', res.status);
      if (res.status === 204) {
        axios
          .get('https://api.spotify.com/v1/me/player', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          .then(() => {
            // Transferred playback successfully, get current timestamp
            CheckChangePositionCallBack();
          })
          .catch(err => {
            //logger.log(err);
          });
      }
    })
    .catch(e => console.error(e));
};

export function GetUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

