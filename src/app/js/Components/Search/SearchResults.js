import React from 'react'
import ArtistView from '../ContentView/ArtistView/ArtistView.js';
import TrackView from '../ContentView/TrackView/TrackView.js';

const SearchResults = (props) => {
    return (
        <div>
            <h1>Song Results</h1>
            {props.data.tracks.items.map((track) => (
                
                <div key={track.id}>
                    {track.album.images.length > 0 ? <img src={track.album.images[track.album.images.length - 1].url} alt=''></img> : null }
                    <div style={{color: 'white'}}>{track.name}</div>
                    <div style={{color: 'white'}}>{track.album.name}</div>
                </div>
            ))}
            <h1>Album Results</h1>
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
            ))}
        </div>
    )
};

export default SearchResults;

// {props.data.playlist.items.map((album) => ())}

// playlist.images.length - 1
// playlist.name
// playlist.owner.display_name
