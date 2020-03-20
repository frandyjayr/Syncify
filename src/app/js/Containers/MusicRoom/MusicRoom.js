import React, { Component } from 'react';
import Sidebar from '../Sidebar/Sidebar.js';
import Header from '../../Components/Header/Header.js';
import QueueBar from '../../Components/QueueBar/QueueBar.js';
import RoomController from '../RoomController/RoomController.js';
import { SpotifyApiContext } from 'react-spotify-api';
import { withRouter } from 'react-router-dom';
import SpotifyMusicPlayer from '../SpotifyMusicPlayer/SpotifyMusicPlayer.js';
import socketIOClient from 'socket.io-client';
import SocketContext from '../../Utility/Context/SocketContext.js';
import './MusicRoom.css';

class MusicRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: null,
            queue: []
        }
        this.socket = socketIOClient('localhost:4000');
    }

    updateQueue = (newQueue) => {
        this.setState({queue: newQueue});
    }

    componentDidMount = () => {
        if (this.socket) {
            this.socket.on('updateQueue', (newQueue) => { this.updateQueue(newQueue)});
            this.socket.on('updateNewUserQueue', (newQueue) => { this.updateQueue(newQueue)});
        }    
    }

    render () {
        return (
            <SocketContext.Provider value={this.socket}>
                <SpotifyApiContext.Provider value={this.props.accessToken}>
                    <Header></Header>          

                    <div className='musicroom_sidebar_container'>
                        <Sidebar></Sidebar>
                        <QueueBar queue={this.state.queue}></QueueBar>
                    </div>
                    
                    <RoomController></RoomController>
                    <div>ChatRoom</div>
                    <SpotifyMusicPlayer></SpotifyMusicPlayer>                               
                </SpotifyApiContext.Provider>
            </SocketContext.Provider>
        );
    }
}

export default withRouter(MusicRoom);