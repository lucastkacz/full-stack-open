import React from "react";

const Course = ({ courses }) => {
	return (
		<ul>
			{courses.map((course) => (
				<div key={course.id}>
					<h2>{course.name}</h2>

					{course.parts.map((part) => (
						<div key={part.id}>
							<p>
								{part.name} {part.exercises}
							</p>
						</div>
					))}
					<p>total of {course.parts.reduce((acc, part) => acc + part.exercises, 0)} exercises</p>
				</div>
			))}
		</ul>
	);
};

export default Course;
