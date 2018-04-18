import React from 'react';

const QuestionsHeader = ({ handleClick, handleChange, handleSubmit, newQuestion }) => {
	return (
		<div>
			<button onClick={() => handleClick('asc')}>Sort ASC</button>
			<button onClick={() => handleClick('desc')}>Sort DESC</button>
			<form onSubmit={handleSubmit}>
				<input type="text" value={newQuestion} onChange={handleChange} />
				<button>Ask Question</button>
			</form>
		</div>
	);
};

export default QuestionsHeader;
