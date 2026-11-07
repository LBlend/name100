import type { Match } from "@/types";
import { NextResponse } from "next/server";
import { findNorwegianPerson } from "./dataProvider";

const MAX_INPUT_LENGTH = 100;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const input = typeof body?.input === "string" ? body.input.trim() : "";

  if (!input || input.length > MAX_INPUT_LENGTH) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const match: Match = await findNorwegianPerson(input);
  return NextResponse.json(match);
}
