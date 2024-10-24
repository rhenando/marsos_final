import { verifyTokenFromCookie } from "../../middleware/verifyTokenFromCookie"; // Adjust the path to the middleware

export async function GET(req, res) {
  // Use the middleware to verify the JWT token from cookies
  verifyTokenFromCookie(req, res, () => {
    // If token is valid, this part of the code will be executed
    res
      .status(200)
      .json({
        message: "You have access to the protected resource",
        user: req.user,
      });
  });
}
