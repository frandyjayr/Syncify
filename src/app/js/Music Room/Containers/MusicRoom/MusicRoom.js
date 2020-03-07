import React, { Component } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar.js';

class MusicRoom extends Component {
    render () {
        return (
            <div>
                <Sidebar></Sidebar>
                <div>ChatRoom</div>
                <div>Music Player</div>
            </div>
        );
    }
}

export default MusicRoom;