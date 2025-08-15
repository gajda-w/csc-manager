ARG DENO_VERSION=2.3.6
FROM denoland/deno:${DENO_VERSION}

WORKDIR /app
EXPOSE 8000

COPY . .
RUN deno install --allow-scripts

CMD ["deno", "task", "dev", "--host", "0.0.0.0"]
