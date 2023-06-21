import { FC, useEffect, useState } from "react";
import { socket } from "../utils/socket";

interface Result {
	model: string;
	result: string;
}

export const Results: FC = () => {
	const [pose, setPose] = useState<string | null>(null);
	const [result, setResult] = useState<Result | null>(null);

	useEffect(() => {
		if (!socket.connected) socket.connect();

		socket.on("pose", (d: string) => {
			setPose(d);
		});

		socket.on("result", (d: Result) => {
			setResult(d);
		});
	}, []);

	return (
		<div className="flex flex-col items-center">
			<div className="max-w-md">
				{pose ? (
					<video src={pose} autoPlay={true} controls={true} />
				) : (
					<span>Waiting for skeleton...</span>
				)}
			</div>
			<div className="flex flex-col mt-4">
				{result ? (
					<div className="flex flex-col">
						<span>
							{result.model} result:{" "}
							<span className="font-bold text-lg">{result.result}</span>
						</span>
					</div>
				) : (
					<span>Waiting for results...</span>
				)}
			</div>
		</div>
	);
};
