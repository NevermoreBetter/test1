import { db } from "@/lib/prisma";

enum HTTPStatusCode {
 OK = 200,
 FORBIDDEN = 403,
}

export async function GET(req: Request) {
 try {
  const url = new URL(req.url);

  const take = url.searchParams.get("take");
  const lastCursor = url.searchParams.get("lastCursor");
  const FIRST_FETCH_TAKE = 10;
  const NEXT_FETCH_TAKE = 7;

  let result = await db.event.findMany({
   take: take ? parseInt(take as string) : FIRST_FETCH_TAKE,
   ...(lastCursor && {
    skip: 1,
    cursor: {
     id: lastCursor as string,
    },
   }),
  });

  if (!result.length) {
   return new Response(
    JSON.stringify({
     data: [],
     metaData: {
      lastCursor: null,
      hasNextPage: false,
     },
    }),
    { status: HTTPStatusCode.OK }
   );
  }

  const lastPostInResults: any = result[result.length - 1];
  const cursor: any = lastPostInResults.id;

  const nextPage = await db.event.findMany({
   take: take ? parseInt(take as string) : NEXT_FETCH_TAKE,
   skip: 1,
   cursor: {
    id: cursor,
   },
  });

  const data = {
   data: result,
   metaData: {
    lastCursor: cursor,
    hasNextPage: nextPage.length > 0,
   },
  };

  return new Response(JSON.stringify(data), { status: HTTPStatusCode.OK });
 } catch (error: any) {
  return new Response(
   JSON.stringify(JSON.stringify({ error: error.message })),
   { status: HTTPStatusCode.FORBIDDEN }
  );
 }
}
