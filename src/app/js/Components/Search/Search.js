import React from 'react'

const Search = (props) => {
    return (
        <div>
            <div style={{color: 'white'}}>Search</div>    
            <input type='search' onChange={e => props.searchChange(e)}></input>
        </div>
    )
}

export default Search