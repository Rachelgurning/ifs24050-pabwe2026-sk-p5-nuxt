FROM oven/bun:1.2.22 AS build
WORKDIR /app
COPY package.json ./
RUN bun install
COPY . .
ARG VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
ENV VITE_DELCOM_BASEURL=$VITE_DELCOM_BASEURL
RUN bun run build

FROM oven/bun:1.2.22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]
