import express from "express";
import {
  create,
  getAll,
  getById,
  update,
  deleteOne,
} from "../controllers/controller.js";

const createRoutes = (Model) => {
  const router = express.Router();

  router.post("/", create(Model));
  router.get("/", getAll(Model));
  router.get("/:id", getById(Model));
  router.put("/:id", update(Model));
  router.delete("/:id", deleteOne(Model));

  return router;
};

export default createRoutes;