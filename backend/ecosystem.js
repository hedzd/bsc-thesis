module.exports = {
	apps: [
		{
			name: "app",
			script: "./src/main.js",
			watch: true,
			env: {
				NODE_ENV: "production",
				AWS_BUCKET_NAME: "hedieh-uploads",
				AWS_ACCESS_KEY: "e0ffcdd2-6ed8-4565-9e8a-50899885829e",
				AWS_SECRET_ACCESS_KEY:
					"2a6998d4d03580351b64105b0e73219e1643ef0ca045432ea61a831147535a13",
				AWS_ENDPOINT_URL: "https://s3.ir-thr-at1.arvanstorage.ir",
				AWS_UPLOADS_BUCKET:
					"https://hedieh-uploads.s3.ir-thr-at1.arvanstorage.ir",
			},
		},
	],
};
