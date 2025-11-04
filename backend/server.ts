import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`server is running on port ${PORT}`);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});
