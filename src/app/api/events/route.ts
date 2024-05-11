import { db } from "@/lib/prisma";

export async function GET(req: Request) {
 try {
  const url = new URL(req.url);

  const take = url.searchParams.get("take");
  const lastCursor = url.searchParams.get("lastCursor");

  let result = await db.event.findMany({
   take: take ? parseInt(take as string) : 10,
   ...(lastCursor && {
    skip: 1,
    cursor: {
     id: lastCursor as string,
    },
   }),
  });

  if (result.length == 0) {
   return new Response(
    JSON.stringify({
     data: [],
     metaData: {
      lastCursor: null,
      hasNextPage: false,
     },
    }),
    { status: 200 }
   );
  }

  const lastPostInResults: any = result[result.length - 1];
  const cursor: any = lastPostInResults.id;

  const nextPage = await db.event.findMany({
   take: take ? parseInt(take as string) : 7,
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

  return new Response(JSON.stringify(data), { status: 200 });
 } catch (error: any) {
  return new Response(
   JSON.stringify(JSON.stringify({ error: error.message })),
   { status: 403 }
  );
 }
}
