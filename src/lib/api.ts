import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function fromZodError(error: ZodError): NextResponse {
  const first = error.errors[0];
  return jsonError(first?.message ?? "Invalid input", 422);
}
