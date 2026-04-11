import dotenv from "dotenv";

dotenv.config({
  path: new URL("../../../.env", import.meta.url),
  override: false,
  quiet: true,
});
dotenv.config({
  path: new URL("../../.env", import.meta.url),
  override: true,
  quiet: true,
});
