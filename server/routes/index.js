import express from "express";
const router = express.Router();

// Get home page
router.get("/", (req, res, next) => {
  res.render("index", { title: Express });
});

export default router;
