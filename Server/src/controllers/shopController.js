const shopEngine = require("../engines/shopEngine");

exports.getShop = async (req, res) => {
  try {
    const result = await shopEngine.getShop(req.params.runId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Failed to fetch shop" });
  }
};

exports.buy = async (req, res) => {
  try {
    const result = await shopEngine.buy(req.params.runId, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: true, message: "Purchase failed" });
  }
};
