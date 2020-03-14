import React, { Component } from 'react';
import './MusicPlayer.css';

class MusicPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className='musicplayer_container'>
                <div>song info</div>
                <div>trackcontroller</div>
                <div>volume control</div>
            </div>
        )
    }
}

export default MusicPlayer;