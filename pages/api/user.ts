import { serverSupabase } from "api/modules/server_supabase";
import { IsEmail, Length, Matches } from "class-validator";
import {
  Body,
  Post,
  ValidationPipe,
  createHandler,
  HttpException,
  HttpCode,
  SetHeader,
} from "next-api-decorators";

class CreateUserDTO {
  @Length(3, 64, { message: "Please provide a valid name" })
  name: string = "";

  @IsEmail(undefined, { message: "Please provide a valid email address" })
  email: string = "";

  @Matches(
    /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/,
    {
      message:
        "Password too weak, your password must have at least 6 characters, a lower case, upper case and a numeric character",
    }
  )
  password: string = "";
}

class UserApiHandler {
  @Post()
  @HttpCode(201)
  @SetHeader("Content-Type", "application/json")
  public async create_user(@Body(ValidationPipe) data: CreateUserDTO) {
    const result = await serverSupabase.auth.api.createUser({
      email: data.email,
      password: data.password,
    });

    if (result.error !== null || result.user === null) {
      const message = result.error?.message || "Error creating user";
      const status = result.error?.status || 500;
      throw new HttpException(status, message);
    }

    return JSON.stringify({ message: "User created successfully" });
  }
}

export default createHandler(UserApiHandler);
