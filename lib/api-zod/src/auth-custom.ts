import * as zod from "zod";

export const RegisterBody = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
  firstName: zod.string().min(1, "First name is required").max(100),
  lastName: zod.string().min(1, "Last name is required").max(100),
  dateOfBirth: zod.string().optional(),
});

export const LoginBody = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(1, "Password is required"),
});

export const RegisterResponse = zod.object({
  user: zod.object({
    id: zod.string(),
    email: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
    dateOfBirth: zod.string().nullable().optional(),
  }),
});

export const LoginResponse = RegisterResponse;

export type RegisterBodyType = zod.infer<typeof RegisterBody>;
export type LoginBodyType = zod.infer<typeof LoginBody>;
