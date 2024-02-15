FROM denoland/deno:alpine

EXPOSE 3000

WORKDIR /app

USER deno

COPY deps.ts .
COPY deno.lock .
RUN deno cache --lock=deno.lock deps.ts

ADD . .
RUN deno cache --lock=deno.lock cmd/serve.ts

CMD [ "run", "--allow-net", "cmd/serve.ts" ]
