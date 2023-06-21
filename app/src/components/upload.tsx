import axios from "axios";
import classNames from "classnames";
import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { socket } from "../utils/socket";

const extensions = [".mp4"];
const types = "video/mp4";

const poseModels = [
	{ id: "openpose", title: "Lightweight OpenPose" },
	{ id: "mediapipe", title: "MediaPipe" },
];

const actionModels = [
	{ id: "stgcn_uniform", title: "ST-GCN Uniform" },
	{ id: "stgcn_distance", title: "ST-GCN Distance" },
	{ id: "stgcn_filterv", title: "ST-GCN Filter Visibility Score" },
	{ id: "mstgcn_uniform", title: "MST-GCN Uniform" },
	{ id: "mstgcn_spatial", title: "MST-GCN Spatial" },
	{ id: "mstgcn_filterv", title: "MST-GCN Filter Visibility Score" },
];

export const UploadVideo: FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
	const [formValue, setFormValue] = useState<{
		action: string;
		pose: string;
	}>({ action: actionModels[0].id, pose: poseModels[0].id });
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
			formData.append("pose", formValue.pose);
			formData.append("action", formValue.action);
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
			className="flex flex-col w-full justify-center items-center max-w-md"
			onSubmit={handleSubmit}
		>
			<div className="flex items-center justify-center w-full">
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
						<p className="text-xs text-black">Supported: {extensions}</p>
					</div>
					<input
						id="dropzone-file"
						type="file"
						className="hidden"
						onChange={handleFileChange}
					/>
				</label>
			</div>
			<div className="text-left w-full mt-4">
				<label className="text-base font-medium text-gray-900">
					Pose estimation method
				</label>
				<fieldset className="mt-4">
					<div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
						{poseModels.map((method) => (
							<div key={method.id} className="flex items-center">
								<input
									id={method.id}
									name="pose"
									type="radio"
									checked={method.id === formValue.pose}
									className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
									onChange={() =>
										setFormValue((v) => ({ ...v, pose: method.id }))
									}
								/>
								<label
									htmlFor={method.id}
									className="ml-3 block text-sm font-medium text-gray-700"
								>
									{method.title}
								</label>
							</div>
						))}
					</div>
				</fieldset>
			</div>
			<div className="text-left w-full mt-4">
				<label className="text-base font-medium text-gray-900">
					Action recognition method
				</label>
				<fieldset className="mt-4">
					<div className="space-y-4 sm:flex sm:items-center sm:space-y-4 flex-col">
						{actionModels.map((method) => (
							<div key={method.id} className="flex items-center w-full">
								<input
									id={method.id}
									name="action"
									type="radio"
									checked={method.id === formValue.action}
									className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
									onChange={() =>
										setFormValue((v) => ({ ...v, action: method.id }))
									}
								/>
								<label
									htmlFor={method.id}
									className="ml-3 block text-sm font-medium text-gray-700"
								>
									{method.title}
								</label>
							</div>
						))}
					</div>
				</fieldset>
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
