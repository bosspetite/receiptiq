import { app } from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("");
    console.log(`  ReceiptIQ API  ->  http://localhost:${PORT}`);
    console.log(`  Health check   ->  http://localhost:${PORT}/api/health`);
    console.log("");
});
