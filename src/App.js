import React, { Component } from 'react';
import MusicRoomLayout from './app/js/Music Room/Components/MusicRoomLayout/MusicRoomLayout.js';
import MusicRoom from './app/js/Music Room/Containers/MusicRoom/MusicRoom.js';

class App extends Component {
  render() {
    return (
    <div>
      <MusicRoomLayout>
        <MusicRoom></MusicRoom>
      </MusicRoomLayout>
    </div>
    )
  };
}

export default App;
