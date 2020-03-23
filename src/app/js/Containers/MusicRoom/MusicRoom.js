import React, { Component } from 'react';
import Sidebar from '../Sidebar/Sidebar.js';
import Header from '../../Components/Header/Header.js';
import ChatRoom from '../../Containers/ChatRoom/ChatRoom.js';
import QueueBar from '../../Components/QueueBar/QueueBar.js';
import RoomController from '../RoomController/RoomController.js';
import { SpotifyApiContext } from 'react-spotify-api';
import { withRouter } from 'react-router-dom';
import SpotifyMusicPlayer from '../SpotifyMusicPlayer/SpotifyMusicPlayer.js';
import io from 'socket.io-client';
import SocketContext from '../../Utility/Context/SocketContext.js';
import './MusicRoom.css';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Wrapper from '../../Utility/Wrapper/Wrapper.js';
import '../../Utility/Wrapper/Wrapper.css';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

class MusicRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: null,
            queue: []
        }

        this.musicRoomSocket = io('localhost:4000/music-room');
    }

    updateQueue = (newQueue) => {
        this.setState({queue: newQueue});
    }

    componentDidMount = () => {
        if (this.musicRoomSocket) {
            this.musicRoomSocket.on('updateQueue', (newQueue) => { this.updateQueue(newQueue)});
            this.musicRoomSocket.on('updateNewUserQueue', (newQueue) => { this.updateQueue(newQueue)});
        }    
    }

    render () {
        return (
            <SocketContext.Provider value={{musicRoomSocket: this.musicRoomSocket}}>
                <SpotifyApiContext.Provider value={this.props.accessToken}>  
                    <Wrapper className='musicroomwrapper'>        
                    <div className='musicroom_header'><Header></Header> </div>                                                                                       
                        <Grid container spacing={0} className='musicroom_body'>                            
                            <Grid item xs={3}><Sidebar></Sidebar></Grid>
                            <Grid item xs={2}><QueueBar queue={this.state.queue}></QueueBar></Grid>                                   
                            <Grid item xs={5}><ChatRoom></ChatRoom></Grid>
                            <Grid item xs={2}><RoomController></RoomController></Grid>                                                    
                        </Grid> 
                        <SpotifyMusicPlayer></SpotifyMusicPlayer>
                    </Wrapper>                                                                      
                </SpotifyApiContext.Provider>
            </SocketContext.Provider>
        );
    }
}

export default withRouter(MusicRoom);