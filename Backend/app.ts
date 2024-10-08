import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/v1/users", userRoutes);

app.use("/ping", (req, res) => {
  res.send("pong");
});

app.all("*", (req, res) => {
  res.status(404).send("OOPS!! 4040 page not found");
});

export default app;
