import React from "react";

const Page = ({ title }) => (
  <div className="max-w-5xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-semibold">{title}</h1>
  </div>
);

export const authRoutes = [
  { path: "login", element: <Page title="Login" /> },
];
