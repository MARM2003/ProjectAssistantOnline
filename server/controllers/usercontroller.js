const User = require("../models/user");


// Get all developers
const getDevelopers = async (req, res) => {
  try {
    // Only return users with role Developer
    const developers = await User.find({ role: "Developer" }).select("_id name email role");
    res.status(200).json(developers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDevelopers };