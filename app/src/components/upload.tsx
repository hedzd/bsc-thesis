import axios from "axios";
import classNames from "classnames";
import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { socket } from "../utils/socket";

const extensions = [".mp4"];
const types = "video/mp4";

export const UploadVideo: FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	useEffect(() => {
		if (!socket.connected) socket.connect();
	});

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (isLoading) return;

		const newFile = e.target?.files?.[0];

		if (!newFile) {
			setError("No File Added");
			return;
		}

		if (
			!extensions.some((v) => newFile.name.includes(v)) ||
			!types.includes(newFile.type)
		) {
			setError("File type or extension is not supported");
			return;
		}

		setFile(newFile);
		setError(null);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isLoading) return;

		if (!file) {
			setError("No file is selected");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("video", file);
			setLoading(true);
			const data = await axios<string>(`${process.env["REACT_APP_API"]}/new`, {
				method: "POST",
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			});
			setLoading(false);
			socket.emit("join", data.data);
			onSubmit();
		} catch (error: any) {
			setError(error?.response?.data || "Something went wrong");
			setFile(null);
		}
	};

	const canSubmit = !!file && !error && !isLoading;

	return (
		<form
			className="flex flex-col w-full justify-center items-center"
			onSubmit={handleSubmit}
		>
			<div className="flex items-center justify-center w-full max-w-md">
				<label
					htmlFor="dropzone-file"
					className="flex flex-col items-center justify-center w-full h-64 border-2 rounded-lg cursor-pointer bg-gray-200 border-gray-200 hover:border-gray-300 hover:bg-gray-300"
				>
					<div className="flex flex-col items-center justify-center pt-5 pb-6">
						<svg
							aria-hidden="true"
							className="w-10 h-10 mb-3 text-black"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							></path>
						</svg>
						<p className="mb-2 text-sm text-black">
							{file ? (
								`${file.name}`
							) : (
								<>
									<span className="font-semibold">Click to upload</span>
								</>
							)}
						</p>
						<p className="text-xs text-black">Supported: MP4</p>
					</div>
					<input
						id="dropzone-file"
						type="file"
						className="hidden"
						onChange={handleFileChange}
					/>
				</label>
			</div>
			<span className="text-red-600 mt-3 font-normal">{error}</span>
			<button
				type="submit"
				disabled={!canSubmit}
				className={classNames(
					"rounded-xl px-6 py-2 mt-6 text-white",
					!canSubmit ? "bg-gray-400" : "bg-green-600"
				)}
			>
				{isLoading ? "Uploading..." : "Submit"}
			</button>
		</form>
	);
};
