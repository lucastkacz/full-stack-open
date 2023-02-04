import React from "react";

const Filter = ({ searchName, handleSearchChange }) => {
	return (
		<form>
			<div>
				filter names shown with <input value={searchName} onChange={handleSearchChange} />
			</div>
		</form>
	);
};

export default Filter;
