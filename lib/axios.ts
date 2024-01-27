"use client";

import axios from "axios";

const AxiosClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  timeoutErrorMessage: "Timeout",
});

export const login = async (data: { email: string; password: string }) => {
  await AxiosClient.post("/login", data);
};

export default AxiosClient;
