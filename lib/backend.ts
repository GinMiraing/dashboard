"use server";

import { NextResponse } from "next/server";

import RedisClient from "./redis";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export const BadRequest = (message?: string) => {
  return NextResponse.json(
    { message: message || "bad request" },
    { status: 400 },
  );
};

export const Forbidden = (message?: string) => {
  return NextResponse.json(
    { message: message || "forbidden" },
    { status: 403 },
  );
};

export const NotFound = (message?: string) => {
  return NextResponse.json(
    { message: message || "not found" },
    { status: 404 },
  );
};

export const InternalServerError = (message?: string) => {
  return NextResponse.json(
    { message: message || "internal server error" },
    { status: 500 },
  );
};

export const CheckApiKey = async (request: Request) => {
  const apiKey = request.headers.get("api-key");

  if (!apiKey) {
    throw new Error("api-key not found");
  }

  const exist = await RedisClient.get(apiKey);

  if (!exist) {
    throw new Error("api-key not found");
  }
};

export const checkAdminToken = async (session: string) => {
  if (session !== ADMIN_TOKEN) {
    throw new Error("admin token not match");
  }
};
