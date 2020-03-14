import React from 'react';
const LogonPage = (props) => {
    return (
    <div>

          <label>Email: </label> <input type="text"></input>
          <label>Password: </label> <input type="text"></input>
          <button onClick={props.authenticateUser}>Submit</button>

        <div hidden={true}> Invalid User or Password</div>
      </div>
    )
}

export default LogonPage;