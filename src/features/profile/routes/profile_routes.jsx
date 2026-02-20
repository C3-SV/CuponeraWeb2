import React from "react";
import Profile from "../compopnents/profile";

const Page = ({ title }) => (
  <div className="max-w-5xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-semibold">{title}</h1>
  </div>
);

export const profileRoutes = [
  { path: "profile", element: <Profile/> },
];
