import React, { Component } from 'react';
import { connect } from 'react-redux';
import MusicPlayerFooter from '../../Components/MusicPlayerFooter/MusicPlayerFooter';
import axios from 'axios';
import * as actionTypes from '../../Store/Actions/ActionTypes';

class SpotifyMusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceId: null,
            playingInfo: null,
            playerInitError: false,
            playing: false,
            positionSliderValue: 50,
            volumeSliderValue: 50
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
            //logger.log('player state changed', state);
            let { duration, position } = state;
            // duration = 100%
            // position = ?%
            let val = (position * 100) / duration;
            this.setState({
              playingInfo: state,
              playing: !state.paused,
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
    
            if (this.props.isPlaying === state.paused) {
                //add back in jayr was testing
              //this.props.setIsPlaying(!state.paused);
            }
    
            if (
              !this.props.currentlyPlaying ||
              this.props.currentlyPlaying !== state.track_window.current_track.name
            ) {
              let { current_track } = state.track_window;
              // add back in jayr was causing error for now wanted to test functionality
              //this.props.setCurrentlyPlaying(current_track.name);
            }
          }
        });
    
        this.player.on('ready', data => {
          let { device_id } = data;
          this.setState({ deviceId: device_id }, () => {
            this.transferPlaybackHere();
          });
          this.player.getVolume().then(vol => {
            let volume = vol * 100;
            this.setState({ volumeSliderValue: volume });
          });
        });
      };

    CheckForPlayer = () => {
        console.log(window.Spotify);
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

    transferPlaybackHere = () => {
        // ONLY FOR PREMIUM USERS - transfer the playback automatically to the web app.
        // for normal users they have to go in the spotify app/website and change the device manually
        // user type is stored in redux state => this.props.user.type
        const { deviceId } = this.state;
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.props.accessToken}`,
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
                    Authorization: `Bearer ${this.props.accessToken}`
                  }
                })
                .then(() => {
                  // Transferred playback successfully, get current timestamp
                  this.CheckChangePosition();
                })
                .catch(err => {
                  //logger.log(err);
                });
            }
          })
          .catch(e => console.error(e));
    
        // logger.log('Hello', this.props);
        // if (this.props.user.product === 'premium') {
        // } else {
        //   logger.log(
        //     'Cannot transfer playback automatically because you are not a premium user.'
        //   );
        // }
    };

    checkChangePosition = () => {
      this.player.getCurrentState().then(state => {
        if (state) {
          let { duration, position } = state;
          // duration = 100%
          // position = ?%
          let val = (position * 100) / duration;
          if (val !== this.state.positionSliderValue) {
            this.setState({
              positionSliderValue: val
            });
          }
  
          let positionStamp = this.MilisToMinutesAndSeconds(state.position);
          let durationStamp = this.MilisToMinutesAndSeconds(state.duration);
          this.setState({ positionStamp, durationStamp });
        }
      });
    };


    MilisToMinutesAndSeconds = mil => {
      let minutes = Math.floor(mil / 60000);
      let seconds = ((mil % 60000) / 1000).toFixed(0);
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };
    

    PrevClick = () => {        
        this.player.previousTrack();
    };
    
    PlayClick = () => {
        console.log(this.player);
        this.player.togglePlay();
    };

    NextClick = () => {
        this.player.nextTrack();
    };

    componentDidMount = () => {
        this.playerCheckInterval = setInterval(() => this.CheckForPlayer(), 1000);
    }

    render() {
        return (
            <div>
                <MusicPlayerFooter 
                  playClick={this.PlayClick}
                  prevClick={this.PrevClick}
                  nextClick={this.NextClick}>  
                </MusicPlayerFooter>                
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

const mapDispatchToProps = (dispatch) => {
    return {
        setPlayer: (player) => dispatch({ type: actionTypes.SET_PLAYER, payload : { player: player}})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SpotifyMusicPlayer);