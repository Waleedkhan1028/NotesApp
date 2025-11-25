import { dbConnect } from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { signupSchema } from '../../../lib/schemas';

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface UserData {
  username: string;
  email: string;
  password: string;
}

export class SignupRepository {
  static async validateSignupData(signupData: SignupData): Promise<string | null> {
    try {
      // Use Yup schema for validation
      await signupSchema.validate(signupData, { abortEarly: false });
      return null;
    } catch (error: any) {
      // Return the first validation error message
      if (error.errors && error.errors.length > 0) {
        return error.errors[0];
      }
      return "Validation failed";
    }
  }

  static async checkExistingUser(username: string, email: string) {
    await dbConnect();
    return await User.findOne({ $or: [{ username }, { email }] });
  }

  static async createUser(userData: UserData) {
    await dbConnect();
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    return await User.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });
  }


}