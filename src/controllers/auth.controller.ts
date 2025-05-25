import { Request, Response } from "express";

import * as Yup from "yup";

import UserModel from "../models/user.models";
type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Password must be matched"),
});

export default {
  async register(req: Request, resp: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        email,
        username,
        password,
      });

      resp.status(200).json({
        message: "Success registration",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      resp.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
