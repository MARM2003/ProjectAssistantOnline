const bcrypt =require("bcryptjs");
const  User =require("../models/user");
const jwt = require("jsonwebtoken")
//user register


const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const userData = { name, email, password: hashedPassword, role };

  
    if (role === "Viewer") {
      userData.projectId = null; 
    }

    
    const newUser = new User(userData);
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Error in registerUser:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


//generate token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "45m" }
  );
const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}


 const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refreshToken in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // change to true in production (with https)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

   return res.status(200).json({ accessToken ,email:user.email,role:user.role,id:user._id})
  } catch (err) {
    console.log("server error",err)
   return  res.status(500).json({ message: "Server error" },err);
  }
};

// ✅ Refresh Token
 const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
};

module.exports={registerUser,loginUser,refreshAccessToken};
