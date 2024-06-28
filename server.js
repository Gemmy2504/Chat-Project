//import("dotenv").config;
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { StreamChat } from "stream-chat";

const app = express();
app.use(express.json());
dotenv.config();
// initialize Stream Chat SDK
const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

app.post("/join", async (req, res) => {
  console.log(process.env.STREAM_API_KEY);
  console.log(process.env.STREAM_APP_SECRET);
  console.log(req.body);
  const { username } = req.body;
  const token = serverSideClient.createToken(username);
  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username,
      },
      token
    );

    const admin = { id: "admin" };
    const channel = serverSideClient.channel("team", "general", {
      name: "General",
      created_by: admin,
    });

    await channel.create();
    await channel.addMembers([username, "admin"]);

    res
      .status(200)
      .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

const server = app.listen(process.env.PORT || 5500, () => {
  const { port } = server.address();
  console.log(`Server running on PORT ${port}`);
});
