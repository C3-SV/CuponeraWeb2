import { Router } from "express";
import { asyncHandler } from "../../lib/http.js";
import { requireAuth, requireRole } from "../../lib/auth.js";
import {
  createAdminUser,
  createCategory,
  deleteAdminUser,
  deleteCategory,
  listAdminUsers,
  listCategoriesAdmin,
  listCustomers,
  updateAdminUser,
  updateCategory,
} from "./admin.service.js";

const router = Router();

router.use(requireAuth, requireRole("admin.general"));

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      items: await listAdminUsers({ search: req.query.search }),
    });
  }),
);

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    res.status(201).json({
      ok: true,
      item: await createAdminUser(req.body),
    });
  }),
);

router.patch(
  "/users/:userId",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      item: await updateAdminUser(req.params.userId, req.body),
    });
  }),
);

router.delete(
  "/users/:userId",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      ...(await deleteAdminUser({
        userId: req.params.userId,
        actorUserId: req.auth.user.id,
      })),
    });
  }),
);

router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      items: await listCategoriesAdmin({ search: req.query.search }),
    });
  }),
);

router.post(
  "/categories",
  asyncHandler(async (req, res) => {
    res.status(201).json({
      ok: true,
      item: await createCategory(req.body),
    });
  }),
);

router.patch(
  "/categories/:categoryId",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      item: await updateCategory(req.params.categoryId, req.body),
    });
  }),
);

router.delete(
  "/categories/:categoryId",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      ...(await deleteCategory(req.params.categoryId)),
    });
  }),
);

router.get(
  "/customers",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      ...(await listCustomers(req.query)),
    });
  }),
);

export const adminRouter = router;
