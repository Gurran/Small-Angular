
FROM node:lts-alpine3.23 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build


FROM nginx:1.31.1-alpine-slim AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/myApp/browser/* /usr/share/nginx/html

EXPOSE 80