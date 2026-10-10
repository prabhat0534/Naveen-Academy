const jwt = require("jsonwebtoken");

const ADMIN_CREDENTIALS = {
  email: "admin@naveenacademy.com",
  password: "admin@naveen123",
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    if (
      email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase() ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const secret = process.env.JWT_SECRET || "naveenacademy123";
    const token = jwt.sign(
      { email: ADMIN_CREDENTIALS.email, role: "Director" },
      secret,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        name: "Director (Naveen Academy)",
        email: ADMIN_CREDENTIALS.email,
        role: "Director",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login.",
    });
  }
};