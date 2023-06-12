import { FC, useEffect, useState } from "react";
import { socket } from "../utils/socket";

interface Result {
	model: string;
	result: string;
}

export const Results: FC = () => {
	const [skeleton, setSkeleton] = useState<string | null>(null);
	const [results, setResults] = useState<Result[]>([]);

	useEffect(() => {
		if (!socket.connected) socket.connect();

		socket.on("skeleton", (d: string) => {
			setSkeleton(d);
		});

		socket.on("result", (d: Result) => {
			setResults((r) => [...r, d]);
		});
	}, []);

	return (
		<div className="flex flex-col items-center">
			<div className="max-w-md">
				{skeleton ? (
					<video src={skeleton} autoPlay={true} controls={true} />
				) : (
					<span>Waiting for skeleton...</span>
				)}
			</div>
			<div className="flex flex-col mt-4">
				{!!results.length ? (
					<div className="flex flex-col">
						{results.map((v) => (
							<span key={v.model}>
								{v.model} result:{" "}
								<span className="font-bold text-lg">{v.result}</span>
							</span>
						))}
					</div>
				) : (
					<span>Waiting for results...</span>
				)}
			</div>
		</div>
	);
};