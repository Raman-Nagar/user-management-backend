import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { connectDB } from "./config/database.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 4040;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start", err);
    process.exit(1);
  }
})();
