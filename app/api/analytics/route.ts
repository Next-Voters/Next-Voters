import { NextResponse } from "next/server";
import { handleGetRequestCount, handleGetResponseCount } from "@/lib/analytics";
import returnErrorResponse from "@/lib/error";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const responseCount = await handleGetResponseCount();
    const requestCount = await handleGetRequestCount();

    return NextResponse.json({
      requestCount,
      responseCount,
    });
  } catch (error) {
    return returnErrorResponse(error);
  }
}
