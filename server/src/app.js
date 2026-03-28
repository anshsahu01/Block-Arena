import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

const allowedOrigins = [
	process.env.CLIENT_URL,
	...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
]
	.map((origin) => origin?.trim())
	.filter(Boolean);

const corsOptions = {
	origin(origin, callback) {
		// Allow non-browser clients (curl/Postman) and same-origin requests.
		if (!origin) {
			callback(null, true);
			return;
		}

		if (allowedOrigins.includes(origin)) {
			callback(null, true);
			return;
		}

		callback(new Error(`CORS blocked for origin: ${origin}`));
	},
	methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
	optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_, res) => res.send("OK"));

export default app;