import React from 'react'
import { connect } from 'react-redux';
import Slider from '@material-ui/core/Slider'

const TrackController = (props) => {
    return (
      <div>
        <Slider value={props.positionSliderValue} onChange={props.handleUISeekChange} onChangeCommitted={props.handleSeekChange} aria-labelledby="continuous-slider" />
        <Slider value={props.volumeSliderValue} onChange={props.handleVolumeChange} aria-labelledby="continuous-slider" />
        <button onClick={() => props.prevClick()}>PREV</button>
        <button onClick={() => props.playClick()}>PLAY</button>
        <button onClick={() => props.nextClick()}>NEXT</button>   
      </div>
    )
}

const mapStateToProps = (state) => {
    return {
      accessToken: state.tokenParams.access_token
    }
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
     
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(TrackController);