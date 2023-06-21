const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { spawn } = require("child_process");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const { config } = require("dotenv");
const multer = require("multer");
config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	socket.on("join", (d) => {
		console.log("Socket", socket.id, "Joined", d);
		socket.join(d);
	});
});

const actionLogKey = "Action: ";
const poseLogKey = "Output: ";

app.use(cors());

const s3 = new S3Client({
	endpoint: process.env["AWS_ENDPOINT_URL"],
	credentials: {
		secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
		accessKeyId: process.env["AWS_ACCESS_KEY"],
	},
});

const upload = multer({
	dest: "/tmp",
});

const spawnPython = (script, logKey, args) =>
	new Promise((r) => {
		const action = spawn("python3", [script, ...args]);
		action.stdout.on("data", (data) => {
			const d = data.toString();

			if (d.includes(logKey)) {
				const line = d
					.split("\n")
					.find((v) => v.startsWith(logKey))
					.replace(logKey, "");
				return r(line);
			}
		});
		action.on("error", (err) => {
			console.error(err);
		});
	});

const getAction = (file, method) =>
	spawnPython("src/scripts/action.py", actionLogKey, [file, method]);

const getPose = (file, method) =>
	spawnPython("src/scripts/pose.py", poseLogKey, [file, method]);

const uploadToS3 = async (file, Key) => {
	const blob = fs.readFileSync(file);
	await s3.send(
		new PutObjectCommand({
			Bucket: process.env["AWS_BUCKET_NAME"],
			Key,
			Body: blob,
			ACL: "public-read",
		})
	);
	return process.env["AWS_UPLOADS_BUCKET"] + "/" + Key;
};

const startProcess = async (pose, action, file) => {
	console.log("Getting pose");
	getPose(file.path, pose).then((poseFile) => {
		console.log("Uploading pose");
		uploadToS3(poseFile, `pose-${Date.now()}.mp4`).then((posePath) => {
			io.in(file.originalname).emit("pose", posePath);
			console.log("Getting action", file, action);
			getAction(file.path, action).then((predicted) => {
				console.log("Got action");
				io.in(file.originalname).emit("result", {
					model: action,
					result: predicted,
				});
			});
		});
	});
};

app.post("/new", upload.single("video"), async (req, res) => {
	const pose = req.body.pose ?? "mediapipe";
	const action = req.body.action ?? "mstgcn_uniform";
	startProcess(pose, action, req.file);
	return res.send(req.file.originalname);
});

app.get("/action", async (req, res) => {
	const action = await getAction(
		"/Users/omidseyfan/Downloads/2VsujhnsVrMD9WqV.mp4",
		"mstgcn_uniform"
	);
	io.emit("result", { model: "mstgcn_uniform", result: action });
	res.send("Done");
});

app.get("/pose", async (req, res) => {
	const poseFile = await getPose(
		"/Users/omidseyfan/Downloads/2VsujhnsVrMD9WqV.mp4",
		"mediapipe"
	);
	const uploaded = await uploadToS3(poseFile, `pose-${Date.now()}.mp4`);
	io.emit("pose", uploaded);
	console.log(uploaded);
	res.send("Done");
});

server.listen(5000, () => {
	console.log("Listening on 5000");
});
