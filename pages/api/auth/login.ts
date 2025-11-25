import type { NextApiRequest, NextApiResponse } from "next";
import { LoginRepository } from "../../../src/api/Repositories/login/index";
import { generateToken } from "../../../src/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { identifier, password } = req.body;


    const validationError = await LoginRepository.validateLoginData({ identifier, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }


    const { user, error } = await LoginRepository.authenticateUser(identifier, password);
    if (error || !user) {
      return res.status(401).json({ message: error });
    }


    const token = generateToken(user._id.toString());
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`);


    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,

      },
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}