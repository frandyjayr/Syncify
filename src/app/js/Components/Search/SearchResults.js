import React from 'react'
import ArtistView from '../ContentView/ArtistView/ArtistView.js';
import TrackView from '../ContentView/TrackView/TrackView.js';
import Wrapper from '../../Utility/Wrapper/Wrapper.js';
import { SearchTrackConfig } from '../../Utility/Configuration/TrackViewConfig.js';
import '../../Utility/Wrapper/Wrapper.css';

const SearchResults = (props) => {
    let config = SearchTrackConfig();
    
    return (
        <div>
            <h1>Song Results</h1>
            {props.data.tracks.items.map((track, index) => (                
                <Wrapper key={track.id + 'songResults' + index} className='tracksearchwrapper'>
                    <TrackView track={track} config={config}></TrackView>
                </Wrapper>
            ))}

            
            {/* <h1>Album Results</h1>
            {props.data.albums.items.map((album) => (
                
                <div key={album.id}>
                    {album.images.length > 0 ? <img src={album.images[album.images.length - 1].url} alt=''></img> : null}
                    <div style={{color: 'white'}}>{album.name}</div>
                </div>
            ))}

            <h1>Artist Results</h1>
            {props.data.artists.items.map((artist) => (
                
                <div key={artist.id}>
                    {artist.images.length > 0 ? <img src={artist.images[artist.images.length - 1].url} alt=''></img> : null}                  
                    <div style={{color: 'white'}}>{artist.name}</div>
                </div>
            ))}
            
            <h1>Playlist Results</h1>
            {props.data.playlists.items.map((playlist) => (
                
                <div key={playlist.id}>
                    {playlist.images.length > 0 ? <img src={playlist.images[playlist.images.length - 1].url} alt=''></img> : null }
                    <div style={{color: 'white'}}>{playlist.name}</div>
                    <div style={{color: 'white'}}>{playlist.owner.display_name}</div>
                </div>
            ))} */}
        </div>
    )
};

export default SearchResults;
