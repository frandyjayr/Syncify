import React from 'react'
import { connect } from 'react-redux'
import './TrackView.css';
import * as actionTypes from '../../../Store/Actions/ActionTypes.js';

const TrackView = (props) => {
    return (
        <div className='trackview_container'>
            {props.config.isPlayable ? (
                <div className='trackview_album' onClick={() => props.changeSong()}>
                    {props.track.album.images.length > 0 ? 
                    <img style={{width: 'auto', height: props.config.height + props.config.heightUnit}} src={props.track.album.images[props.track.album.images.length - 1].url} alt=''></img> : null }
                </div>
            ) : (
                <div>
                {props.track.album.images.length > 0 ? 
                <img style={{width: 'auto', height: props.config.height + props.config.heightUnit}} src={props.track.album.images[props.track.album.images.length - 1].url} alt=''></img> : null }
            </div>
            )}

            <div>
                <div style={{color: 'white'}}>{props.track.name}</div>
                <div style={{color: 'white'}}>{props.track.album.name}</div>
            </div>

        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      currentSong: state.currentSong
    }
  };
  
const mapDispatchToProps = (dispatch) => {
    return {
        changeSong: (songInfo) => dispatch({ type: actionTypes.CHANGE_SONG, payload : { songInfo: songInfo}})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TrackView)