import React, { Component } from 'react';
import Wrapper from '../../Utility/Wrapper/Wrapper.js';
import './RoomController.css';
import socketIOClient from 'socket.io-client';
import SocketContext from '../../Utility/Context/SocketContext.js';
import { connect } from 'react-redux';

class RoomController extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        //this.socket = socketIOClient('localhost:4000');
    }

    joinRoom = (roomId) => {
        let userInfo = {
            roomId: roomId,
            userId: this.props.userId
        }
        this.props.socket.emit('joinRoom', userInfo);
    }

    render() {
        return(
            <Wrapper className="roommanager_container">
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
      {socket => <RoomController {...props} socket={socket}></RoomController>}
    </SocketContext.Consumer>
  )

export default connect(mapStateToProps)(RoomControllerWithSocket);