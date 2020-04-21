import { router } from "express";

router.get(`/`, (_req, res, _next) => {
  res.render(`index`, { title: `Express` });
});

export default router;
