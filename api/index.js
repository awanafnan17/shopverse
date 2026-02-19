// PROBE MODE: Testing if this file runs at all
module.exports = (req, res) => {
    console.log("🔹 PROBE: api/index.js is running!");
    res.status(200).json({
        status: "API Entry Point IS Working",
        message: "If you see this, Vercel is fine. The crash is in server.js",
        env: process.env.NODE_ENV,
        node: process.version
    });
};

/*
let app;
module.exports = async (req, res) => {
    // ... (Original Code)
};
*/
