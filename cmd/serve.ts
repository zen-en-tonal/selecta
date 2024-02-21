import { fromSchema, Record, Schema } from "../mod.ts";

const logMiddle = (
  next: (req: Request) => Promise<Response>,
): (req: Request) => Promise<Response> => {
  return async (req) => {
    const resp = await next(req);
    console.log(`${Date.now()} "${req.method} ${req.url}" ${resp.status}`);
    return resp;
  };
};

const hander = async (req: Request): Promise<Response> => {
  if (req.method === "GET") return health(req);
  if (req.method === "POST") return await fetchAndParse(req);
  return new Response(null, { status: 404 });
};

const health = (_: Request): Response => {
  return new Response(null, {
    status: 200,
  });
};

type RequestSchema = {
  data: Record;
  schema: Schema;
};

const fetchAndParse = async (req: Request): Promise<Response> => {
  try {
    const { data, schema } = (await req.json()) as RequestSchema;
    const spec = fromSchema(schema)(data);
    return new Response(JSON.stringify(spec));
  } catch (e) {
    if (e instanceof Error) {
      const errorMsg = {
        error: e.message,
        reason: e.cause,
      };
      return new Response(JSON.stringify(errorMsg), { status: 400 });
    }
    return new Response(null, { status: 500 });
  }
};

Deno.serve(
  {
    port: 3000,
    hostname: "0.0.0.0",
  },
  logMiddle(hander),
);
