import dotenv from "dotenv";
import { createApplication } from "./server/app";

dotenv.config();

const PORT = 3000;

async function start() {
  try {
    const app = await createApplication();
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Critical error while starting the server:", err);
    process.exit(1);
  }
}

start();
