import React from 'react';

const Question = ({ index, title, rating, handleClick }) => {
	return (
		<li>
			<h2>{title}</h2>
			<p>Rating: {rating}</p>
			<div>
				<button onClick={() => handleClick(index, '+')}>+</button>
				<button onClick={() => handleClick(index, '-')}>-</button>
			</div>
		</li>
	);
};

export default Question;
