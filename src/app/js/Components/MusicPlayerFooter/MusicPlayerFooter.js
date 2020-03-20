import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wrapper from '../../Utility/Wrapper/Wrapper.js'
import TrackView from '../ContentView/TrackView/TrackView.js';
import { CurrentTrackConfig } from '../../Utility/Configuration/TrackViewConfig.js';
import './MusicPlayerFooter.css';

const MusicPlayerFooter = (props) => { 
    return (
        <div className='musicplayerview_container'>
            {props.currentSong.valid ? <Wrapper><TrackView config={CurrentTrackConfig()}></TrackView></Wrapper> : null }
            <div>TrackController</div>
            <div>volume control</div>
            <button onClick={() => props.prevClick()}>PREV</button>
            <button onClick={() => props.playClick()}>PLAY</button>
            <button onClick={() => props.nextClick()}>NEXT</button>
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
      currentSong: state.currentSong,
      accessToken: state.tokenParams.access_token
    }
};
  
const mapDispatchToProps = (dispatch) => {
    return {
        changeSong: () => {}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayerFooter);