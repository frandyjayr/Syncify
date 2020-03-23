import React, { Component } from 'react';
import Wrapper from '../../Utility/Wrapper/Wrapper.js';
import '../../Utility/Wrapper/Wrapper.css';
import './RoomController.css';
import socketIOClient from 'socket.io-client';
import SocketContext from '../../Utility/Context/SocketContext.js';
import { connect } from 'react-redux';

class RoomController extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    joinRoom = (roomId) => {
        let userInfo = {
            roomId: roomId,
            userId: this.props.userId
        }
        this.props.musicRoomSocket.emit('joinRoom', userInfo);
    }

    render() {
        return(
            <Wrapper className="roomcontroller_wrapper">
                <div>
                    <div><button>create Room</button></div>
                </div>
                <div>RoomList
                    <div><button onClick={() => this.joinRoom('room1')}>room1</button></div>
                    <div><button onClick={() => this.joinRoom('room2')}>room2</button></div>
                    <div><button onClick={() => this.joinRoom('room3')}>room3</button></div>
                </div>
            </Wrapper>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
      userId: state.user.id
    }
  };

const RoomControllerWithSocket = (props) => (
    <SocketContext.Consumer>
      {sockets => <RoomController {...props} musicRoomSocket={sockets.musicRoomSocket}></RoomController>}
    </SocketContext.Consumer>
  )

export default connect(mapStateToProps)(RoomControllerWithSocket);