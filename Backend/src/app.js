import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.json({
    limit: "16kb"
}));

import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/users", userRoutes);

export default app;