// Lazy load server to catch initialization errors at runtime
let app;

module.exports = async (req, res) => {
    try {
        if (!app) {
            console.log("🔹 api/index.js: Lazy loading server...");
            app = require('../server/server.js');
            console.log("✅ api/index.js: Server loaded successfully");
        }
        // Express app is a function (req, res) => void
        return app(req, res);
    } catch (error) {
        console.error("❌ CRITICAL: Failed to load/run server.js", error);
        res.status(500).json({
            error: "Critical Server Initialization Failed",
            message: error.message,
            stack: error.stack,
            type: error.code || "Unknown Error"
        });
    }
};
