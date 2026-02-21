import React from "react";

import { Coupons }  from "../../../pages/Coupons";
import { RedeemCoupon } from "../../../pages/RedeemCoupon";

export const couponsRoutes = [
  { path: "mis-cupones", element : <Coupons/>},
  { path: "redeem", element : <RedeemCoupon/>}
];
