import userModel from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { redis } from "../utils/redis";
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(String(id));
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(200).json({
      success: true,
      user,
    });
  }
};

//Get all users
export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      users,
    });
};


//update user role

export const updateUserRoleService = async (res: Response, id: string, role: string) => {
  const user = await userModel.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  
  res.status(200).json({
    success: true,
    user,
  });
};