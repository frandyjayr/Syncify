import React from 'react';

const MusicRoomLayout = (props) => (
	<div>
		<div>Header</div>
		<main>
			{props.children}
		</main>
	</div>
);

export default MusicRoomLayout;