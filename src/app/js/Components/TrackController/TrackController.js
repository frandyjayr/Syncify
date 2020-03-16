import React from 'react'
import SpotifyPlayer from 'react-spotify-web-playback';
import { connect } from 'react-redux';
import * as actionTypes from '../../Store/Actions/ActionTypes.js';

const TrackController = (props) => {
    return (
        <SpotifyPlayer token={props.accessToken} uris={['spotify:track:1sOr5OXjbukTzBDgmvd6Fa']}></SpotifyPlayer>
    )
}

const mapStateToProps = (state) => {
    return {
      accessToken: state.tokenParams.access_token
    }
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      changeSong: (songInfo) => dispatch({ type: actionTypes.CHANGE_SONG, payload : { songInfo: songInfo}})
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(TrackController);