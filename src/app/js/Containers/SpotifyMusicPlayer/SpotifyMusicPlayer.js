import React, { Component } from 'react';
import { connect } from 'react-redux';
import SocketContext from '../../Utility/Context/SocketContext.js';
import { CurrentTrackConfig } from '../../Utility/Configuration/TrackViewConfig.js';
import Wrapper from '../../Utility/Wrapper/Wrapper.js'
import TrackView from '../../Components/ContentView/TrackView/TrackView.js';
import TrackController from '../../Components/TrackController/TrackController.js'
import {changeSong, transferPlaybackHere } from '../../../api/Spotify/Spotify.js';
import './SpotifyMusicPlayer.css';

class SpotifyMusicPlayer extends Component {
  constructor(props) {
      super(props);
      this.state = {
          deviceId: null,
          playerInitError: false,
          positionSliderValue: 0,
          volumeSliderValue: 50,
          isSeeking: false,
          track: {
            name: '',
            album: {
              name: '',
              images: []
            }
          }
      }
      this.playerCheckInterval = null;
      this.player = null;
      this.positionCheckInterval = null;
  }

  createEventHandlers = () => {
      this.player.on('initialization_error', e => {
        console.error('Initialization error ', e);
        this.setState({ playerInitError: true });
      });
      this.player.on('authentication_error', e =>
        console.error('Authentication error ', e)
      );
      this.player.on('account_error', e => console.error('Account error ', e));
      this.player.on('playback_error', e => console.error('Playback error ', e));
  
      this.player.on('player_state_changed', state => {
        if (state) {
          console.log('player_state_changed');
          let { duration, position } = state;
          if (position >= duration) {
            // todo (need to add in the condition that this should only be executed if you are the host of the room)
            // if not, all of the people in ther room might emit a message to the socket and it could cause
            // undefined behavior like pressing next multiple times
            this.nextClick();
          }
          let val = (position * 100) / duration;
          this.setState({
            positionSliderValue: val
          });
  
          // Music started playing, start the position interval
          if (!this.props.isPlaying && !state.paused) {
            this.positionCheckInterval = setInterval(() => {
              this.checkChangePosition();
            }, 1000);
          }
  
          // Music stopped playing, clear the position interval
          if (this.props.isPlaying && state.paused) {
            clearInterval(this.positionCheckInterval);
          }
        }
      });
  
      this.player.on('ready', data => {
        let { device_id } = data;
        this.setState({ deviceId: device_id }, () => {
          transferPlaybackHere(this.state, this.props.accessToken, this.CheckChangePosition);
        });
        this.player.getVolume().then(vol => {
          let volume = vol * 100;
          this.setState({ volumeSliderValue: volume });
        });
      });
  };

  checkForPlayer = () => {
    if (window.Spotify) {
        clearInterval(this.playerCheckInterval);

        const token = this.props.accessToken;
        this.player = new window.Spotify.Player({
            name: 'Syncify Player',
            getOAuthToken: (cb) => { cb(token); }
        });

        if (this.player) {                
            this.createEventHandlers();          
            this.player.connect();
            console.log("success");
        }
    }
  }

  checkChangePosition = () => {
    this.player.getCurrentState().then( (state) => {
      if (state) {
        let { duration, position } = state;
        let val = (position * 100) / duration;
        if (val !== this.state.positionSliderValue && !this.state.isSeeking) {
          this.setState({
            positionSliderValue: val
          });
        }

        let positionStamp = this.milisToMinutesAndSeconds(state.position);
        let durationStamp = this.milisToMinutesAndSeconds(state.duration);

        if (state.position >= state.duration) {
          this.nextClick();
        }

        this.setState({ positionStamp, durationStamp });
      }
    });
  };

  milisToMinutesAndSeconds = (mil) => {
    let minutes = Math.floor(mil / 60000);
    let seconds = ((mil % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };

  playClick = () => {
    // todo make if else branch to emit either 'playClick' or 'playPause' 
    // depending on the current play state of the player.
    this.player.getCurrentState().then( (state) => {
      if (state) {
        let { duration, position } = state;
        let val = (position * 100) / duration;

        let payload = { 
          trackInfo: {
            uri: state.context.uri,
            positionTimestamp: state.position,
            durationTimestamp: state.duration,
            positionSliderValue: val,
            paused: state.paused
          }
        }
        this.props.musicRoomSocket.emit('playClick', payload)
      }
    });
  };

  prevClick = () => {        
    this.props.musicRoomSocket.emit('prevClick')
  };
  
  nextClick = () => {
    this.props.musicRoomSocket.emit('nextClick')
  };

  syncPlayClick = (payload) => { 
    let trackInfo = {
      name: payload.trackInfo.name,
      album: {
        name: payload.trackInfo.albumName,
        images: [{url:payload.trackInfo.albumSrc}]
      }
    }

    this.player.getCurrentState().then((state) => {
      if (state.context.uri !== payload.trackInfo.uri) {
        changeSong({
          playerInstance: this.player,
          spotify_uri: payload.trackInfo.uri,
          position_ms: payload.trackInfo.positionTimestamp ? payload.trackInfo.positionTimestamp : 0},
          () => this.changeSongState(trackInfo));
      }  
    })
  }

  syncPrevClick = (payload) => {
    let trackInfo = {
      name: payload.trackInfo.name,
      album: {
        name: payload.trackInfo.albumName,
        images: [{url:payload.trackInfo.albumSrc}]
      }
  }

    changeSong({
      playerInstance: this.player,
      spotify_uri: payload.trackInfo.uri,
      position_ms: 0},
      () => this.changeSongState(trackInfo));
  }

  syncNextClick = (payload) => {
    let trackInfo = {
      name: payload.trackInfo.name,
      album: {
        name: payload.trackInfo.albumName,
        images: [{url:payload.trackInfo.albumSrc}]
      }
    }

    changeSong({
      playerInstance: this.player,
      spotify_uri: payload.trackInfo.uri,
      position_ms: 0},
      () => this.changeSongState(trackInfo));
  }

  updatePlayer = (payload) => {
    if (payload && payload.trackInfo) {
      let currentTime = Date.now();
      let startTime = new Date(payload.trackInfo.startTimestamp);
      let position_ms = currentTime - startTime;
      let trackInfo = {
        name: payload.trackInfo.name,
        album: {
          name: payload.trackInfo.albumName,
          images: [{url:payload.trackInfo.albumSrc}]
        }
      }

      changeSong({
        playerInstance: this.player,
        spotify_uri: payload.trackInfo.uri,
        position_ms: position_ms},
        () => this.changeSongState(trackInfo)
      );

    } else {
      this.changeSongState(null);
      this.pausePlayer({
        playInstance: this.player
      })
    }
  }

  pausePlayer = () => {
    this.player.pause();
  }

  changeSongState = (trackInfo) => {
    this.setState({
      track: trackInfo,
      isSeeking: false
    })
  }

  handleUISeekChange = (event, newPosition) => {
    this.setState({
      positionSliderValue: newPosition,
      isSeeking: true
    })
  }

  handleSeekChange = (event, newPosition) => {
    this.setSliderPosition(newPosition);
  }

  handleVolumeChange = (event, newVolume) => {
    this.setState({volumeSliderValue: newVolume});
    this.player.setVolume(newVolume / 100);
  }
  
  setSliderPosition(newPosition) {
    this.player.getCurrentState().then((state) => {
      let payload = {
        trackInfo: {
          uri: state.track_window.current_track.uri,
          name: state.track_window.current_track.name,
          positionTimestamp: ((newPosition) / 100) * state.duration,
          albumName: state.track_window.current_track.album.name,
          albumSrc: state.track_window.current_track.album.images.length > 0 ? state.track_window.current_track.album.images[state.track_window.current_track.album.images.length - 1].url : null
        }
      }      
      this.props.musicRoomSocket.emit('seekTrack', payload)
    })
  }

  componentDidMount = () => {
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
      if (this.props.musicRoomSocket) {
        this.props.musicRoomSocket.on('playClick', (payload) => { this.syncPlayClick(payload); })
        this.props.musicRoomSocket.on('prevClick', (payload) => { this.syncPrevClick(payload) })
        this.props.musicRoomSocket.on('nextClick', (payload) => { this.syncNextClick(payload) })
        this.props.musicRoomSocket.on('pauseClick', (payload) => {this.pausePlayer(payload) })
        this.props.musicRoomSocket.on('updateNewUser', (payload) => { this.updatePlayer(payload) })       
      }
  }

  render() {
      return (
          <div className='spotifymusicplayer_container'>
            <Wrapper><TrackView track={this.state.track} config={CurrentTrackConfig()}></TrackView></Wrapper>
            <TrackController 
              positionSliderValue={this.state.positionSliderValue}
              volumeSliderValue={this.state.volumeSliderValue}
              handleSeekChange={this.handleSeekChange}
              handleVolumeChange={this.handleVolumeChange}
              handleUISeekChange={this.handleUISeekChange}
              playClick={this.playClick}
              prevClick={this.prevClick}
              nextClick={this.nextClick}
            track={this.state.track}></TrackController>       
          </div>
      )
  }
}

const mapStateToProps = (state) => {
    return {
      accessToken: state.tokenParams.access_token,
      isLoggedIn: state.isLoggedIn,
      isAuthenticated: state.isAuthenticated,
      isPlaying: state.isPlaying
    }
};

const SpotifyMusicPlayerWithSocket = (props) => (
  <SocketContext.Consumer>
    {sockets => <SpotifyMusicPlayer {...props} musicRoomSocket={sockets.musicRoomSocket}></SpotifyMusicPlayer>}
  </SocketContext.Consumer>
)

export default connect(mapStateToProps)(SpotifyMusicPlayerWithSocket);