FROM node:14-slim as builder

WORKDIR /app
COPY . /app
RUN yarn install && \
	yarn run build
RUN sed 's/dist\/main/main/g' package.json >> ./package-new.json

## 배포

FROM node:14-slim

WORKDIR /app
COPY --from=builder /app/dist /app
COPY --from=builder /app/.yarn /app/.yarn
COPY --from=builder /app/yarn.lock /app
COPY --from=builder /app/.pnp.cjs /app
COPY --from=builder /app/.pnp.loader.mjs /app
COPY --from=builder /app/.yarnrc.yml /app
COPY --from=builder /app/package-new.json /app/package.json

RUN yarn cache clean --all  && \
	NODE_ENV=production  yarn install

VOLUME ["/app/configuration/config.yml"]

EXPOSE 3001
CMD ["yarn", "run", "start:prod"]



