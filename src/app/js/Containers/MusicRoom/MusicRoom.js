import React, { Component } from 'react';
import Sidebar from '../Sidebar/Sidebar.js';
import Header from '../../Components/Header/Header.js';
import { SpotifyApiContext } from 'react-spotify-api';
import { withRouter } from 'react-router-dom';
import SpotifyMusicPlayer from '../SpotifyMusicPlayer/SpotifyMusicPlayer.js';

class MusicRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount = () => {
    }

    render () {
        return (
            <SpotifyApiContext.Provider value={this.props.accessToken}>
                <Header></Header>                
                <Sidebar></Sidebar>
                <div>ChatRoom</div>
                <SpotifyMusicPlayer></SpotifyMusicPlayer>
                
           
            </SpotifyApiContext.Provider>
        );
    }
}

export default withRouter(MusicRoom);