import request from "supertest";
import express from "express";
import cors from "cors";
import circlesRouter from "../routes/circles";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/circles", circlesRouter);

describe("backend basic", () => {
  it("health should return ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("list circles", async () => {
    const res = await request(app).get("/api/circles");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
