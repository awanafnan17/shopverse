try {
    console.log("🔹 api/index.js: Attempting to load server...");
    const app = require('../server/server.js');
    console.log("✅ api/index.js: Server loaded successfully");
    module.exports = app;
} catch (error) {
    console.error("❌ CRITICAL: Failed to load server.js", error);
    module.exports = (req, res) => {
        res.status(500).json({
            error: "Critical Server Initialization Failed",
            message: error.message,
            stack: error.stack,
            type: error.code || "Unknown Error"
        });
    };
}
