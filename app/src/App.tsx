import { useState } from "react";
import { Results } from "./components/results";
import { UploadVideo } from "./components/upload";

function App() {
	const [waitingForResults, setWaiting] = useState(false);

	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="flex flex-col justify-center text-center w-full">
				<h1 className="font-semibold text-lg mb-8">
					Skeleton-based action recognition
				</h1>
				{waitingForResults ? (
					<Results />
				) : (
					<UploadVideo onSubmit={() => setWaiting(true)} />
				)}
			</div>
		</div>
	);
}

export default App;
