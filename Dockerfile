# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:1.29-alpine AS runtime

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx/runtime-config.template.js /opt/blog/runtime-config.template.js
COPY docker/nginx/40-generate-runtime-config.sh /docker-entrypoint.d/40-generate-runtime-config.sh
COPY --from=build /app/dist /usr/share/nginx/html/blog

EXPOSE 80
STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
