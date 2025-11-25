import type { NextApiRequest, NextApiResponse } from "next";
import { SignupRepository } from "../../../src/api/Repositories/signup/index";
import { generateToken } from "../../../src/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { username, email, password } = req.body;


    const validationError = await SignupRepository.validateSignupData({ username, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }


    const existingUser = await SignupRepository.checkExistingUser(username, email);
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }


    const user = await SignupRepository.createUser({ username, email, password });


    const token = generateToken(user._id.toString());
    res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`);


    return res.status(201).json({
      username: user.username,
      email: user.email,
      message: "User created successfully"
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}