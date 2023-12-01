import { useState } from "react";

const Button = (props) => {
	return <button onClick={props.handleClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
	return (
		<tbody>
			<tr>
				<td>{props.text}</td>
				<td>{props.value}</td>
			</tr>
		</tbody>
	);
};

const Statistics = (props) => {
	const total = props.good + props.neutral + props.bad;
	if (total !== 0) {
		return (
			<table>
				<StatisticLine text="good" value={props.good} />
				<StatisticLine text="neutral" value={props.neutral} />
				<StatisticLine text="bad" value={props.bad} />
				<StatisticLine text="all" value={total} />
				<StatisticLine text="average" value={((props.good - props.bad) / total).toFixed(2)} />
				<StatisticLine text="positive" value={((props.good * 100) / total).toFixed(2) + "%"} />
			</table>
		);
	} else {
		return <div>no feedback given</div>;
	}
};

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<div>
			<h1>give feedback</h1>
			<Button handleClick={() => setGood(good + 1)} text="good" />
			<Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
			<Button handleClick={() => setBad(bad + 1)} text="bad" />

			<h1>statistics</h1>
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
};

export default App;
