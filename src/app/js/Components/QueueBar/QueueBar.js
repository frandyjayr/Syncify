import React from 'react'
import TrackView from '../ContentView/TrackView/TrackView.js';
import Wrapper from '../../Utility/Wrapper/Wrapper.js';
import { QueueTrackConfig } from '../../Utility/Configuration/TrackViewConfig.js';
import '../../Utility/Wrapper/Wrapper.css';
import './QueueBar.css';

const QueueBar = (props) => {
    let config = QueueTrackConfig();
    console.log('config: ', config);

    return(
        <div className='queuebar_container'>
            {props.queue.map((track, index) => (                                
                <Wrapper key={track.trackId + 'queue' + index} className='queuesearchwrapper'>
                    <TrackView track={{
                        name: track.name,
                        uri: track.uri,
                        album: {
                            images: [track.albumSrc]
                        },
                        queuePosition: index
                    }} 
                        config={config}>
                    </TrackView>
                </Wrapper>
            ))}
        </div>
    )
}

export default QueueBar;