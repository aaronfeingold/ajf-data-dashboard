import { NextResponse } from "next/server";

export const handleRouteError = (error: unknown) => {
  return NextResponse.json(
    { error: (error as Error).message },
    { status: 500 }
  );
};
