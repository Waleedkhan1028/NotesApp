import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("⚠️ Please define JWT_SECRET in .env.local");
}


export function generateToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}


export function getUserIdFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}


export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}


export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}


export async function signupUser(username: string, password: string) {
  
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("User already exists with this username");
  }

 
  const hashedPassword = await hashPassword(password);

 
  const user = await User.create({
    username,
    password: hashedPassword,
  });

 
  const token = generateToken(user._id.toString());
  return { token, user };
}


export async function loginUser(username: string, password: string) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());
  return { token, user };
}
