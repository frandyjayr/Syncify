import React from 'react';

const Wrapper = (props) => (
	<div className={props.className}>
		<main>
			{props.children}
		</main>
	</div>
);

export default Wrapper;