"use client";

import axios from "axios";

import {
  CommentCreateSchemaType,
  CommentPrismaType,
  CommentUpdateSchemaType,
} from "./types";

const AxiosClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  timeoutErrorMessage: "Timeout",
});

export const login = async (data: { email: string; password: string }) => {
  await AxiosClient.post("/login", data);
};

export const getApiKey = async () => {
  const result = await AxiosClient.get<{ data: string }>("/unique-key");
  return result.data.data;
};

export const createComment = async (data: CommentCreateSchemaType) => {
  const apiKey = await getApiKey();
  const result = await AxiosClient.post<{ data: CommentPrismaType }>(
    "/comments",
    data,
    {
      headers: {
        "Api-Key": apiKey,
      },
    },
  );
  return result.data.data;
};

export const updateComment = async (
  id: number,
  data: CommentUpdateSchemaType,
) => {
  const result = await AxiosClient.put<{ data: CommentPrismaType }>(
    `/comments/${id}`,
    data,
  );
  return result.data.data;
};

export const deleteComment = async (id: number) => {
  const result = await AxiosClient.delete<{ data: CommentPrismaType }>(
    `/comments/${id}`,
  );
  return result.data.data;
};

export default AxiosClient;
