import React from 'react';

const Wrapper = (props) => (
	<div className={props.className}>
		{props.children}
	</div>
);

export default Wrapper;