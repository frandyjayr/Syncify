import React from 'react'
import { connect } from 'react-redux'
import './TrackView.css';
import SocketContext from '../../../Utility/Context/SocketContext.js';

const TrackView = (props) => {
    if (props.track) {
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
    
                {props.config.canQueue ? <div onClick={() => addToQueue(props.musicRoomSocket, props.track, props.userId)}><button>+</button></div> : <div></div>}
                {props.config.canRemoveQueue ? <div onClick={() => removeFromQueue(props.musicRoomSocket, props.track.queuePosition, props.userId)}><button>-</button></div>: <div></div>}
            </div>
        )
    } else {
        return (
            <div className='trackview_container'></div>
        )
    }

}

const addToQueue = (musicRoomSocket, track, user) => {
    const payload = {
        trackInfo: {
            trackId: track.id,
            name: track.name,
            albumName: track.album.name,
            albumSrc: track.album.images.length > 0 ? track.album.images[track.album.images.length - 1].url : null,
            uri: track.uri
        },
        userInfo: {
            userId: user
        }

    }
    musicRoomSocket.emit('addToQueue', payload);
}

const removeFromQueue = (musicRoomSocket, queuePosition, user) => {
    const payload = {
        trackInfo: {
            queuePosition: queuePosition
        },
        userInfo: {
            userId: user
        }

    }
    musicRoomSocket.emit('removeFromQueue', payload);
}

const mapStateToProps = (state) => {
    return {
      currentSong: state.currentSong,
      userId: state.user.id
    }
};

const TrackViewWithSocket = (props) => (
    <SocketContext.Consumer>
      {sockets => <TrackView {...props} musicRoomSocket={sockets.musicRoomSocket}></TrackView>}
    </SocketContext.Consumer>
)

export default connect(mapStateToProps)(TrackViewWithSocket)