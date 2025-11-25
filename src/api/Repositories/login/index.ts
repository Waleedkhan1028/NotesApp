import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { loginSchema } from '../../../lib/schemas';
import { LoginFormData } from "../../../lib/schemas";

export interface LoginData {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  email: string;
  message: string;
  user?: any;
}

export class LoginRepository {

  static async authenticateUser(identifier: string, password: string) {
    await dbConnect();

    // Support both email and username login
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) {
      return { user: null, error: "Invalid username/email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { user: null, error: "Invalid username/email or password" };
    }

    return { user, error: null };
  }

  static async validateLoginData(loginData: LoginData): Promise<string | null> {
    try {
      // Use Yup schema for validation
      await loginSchema.validate(loginData, { abortEarly: false });
      return null;
    } catch (error: any) {
      // Return the first validation error message
      if (error.errors && error.errors.length > 0) {
        return error.errors[0];
      }
      return "Validation failed";
    }
  }
}