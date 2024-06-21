import { getAuthSession } from "@/lib/auth";
import { reduceText } from "@/lib/reduce-text";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  const { searchParams } = new URL(req.url);
  const link = searchParams.get("link");

  if (!session)
    return NextResponse.json({ error: "Unauthorized request", status: 401 });

  if (!link)
    return NextResponse.json({
      error: "Invalid request, no link provide",
      status: 400,
    });

  const res = await fetch(link);
  const body = await res.text();

  const $ = cheerio.load(body);

  let siteText = "";

  $("p").each((i, el) => {
    siteText += " " + $(el).text();
  });

  const reduced = reduceText(siteText);
  return NextResponse.json(reduced);
}
