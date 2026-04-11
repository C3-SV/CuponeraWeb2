import { Router } from "express";
import { asyncHandler, HttpError } from "../../lib/http.js";
import { requireAuth } from "../../lib/auth.js";
import { updateCurrentUserProfile } from "./auth.service.js";

const router = Router();

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      user: {
        id: req.auth.user.id,
        email: req.auth.user.email ?? null,
      },
      profile: req.auth.profile,
    });
  }),
);

router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const firstNames = String(req.body?.first_names ?? "").trim();
    const lastNames = String(req.body?.last_names ?? "").trim();

    if (!firstNames || !lastNames) {
      throw new HttpError(400, "Nombres y apellidos son obligatorios.");
    }

    const profile = await updateCurrentUserProfile({
      userId: req.auth.user.id,
      email: req.auth.user.email,
      profileInput: {
        first_names: firstNames,
        last_names: lastNames,
        phone: req.body?.phone,
        dui: req.body?.dui,
        address: req.body?.address,
      },
    });

    res.json({ ok: true, profile });
  }),
);

export const authRouter = router;
