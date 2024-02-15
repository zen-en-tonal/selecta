FROM denoland/deno:alpine

EXPOSE 3000

WORKDIR /app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

ADD . .
RUN deno cache cmd/serve.ts

CMD [ "run", "--allow-net", "cmd/serve.ts" ]
