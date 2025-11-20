import type { NextApiRequest, NextApiResponse } from "next";
import { getUserIdFromToken } from "../../../src/lib/auth"; 

import User from "../../../src/models/User"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
  
    const token = req.cookies.token;

    if (!token) {
      return res.status(200).json({
        authenticated: false,
        user: null,
        message: "No token provided"
      });
    }

 
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(200).json({
        authenticated: false,
        user: null,
        message: "Invalid token"
      });
    }

   
    const user = await User.findById(userId); 
  
 

    if (!user) {
      return res.status(200).json({
        authenticated: false,
        user: null,
        message: "User not found"
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: user, 
      message: "Authenticated"
    });

  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(200).json({
      authenticated: false,
      user: null,
      message: "Authentication check failed"
    });
  }
}