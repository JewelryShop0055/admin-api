FROM node:14

CMD ["bash"]
ADD . /app

WORKDIR /app
ENV NODE_ENV=production
RUN yarn
RUN yarn run build

VOLUME ["/app/sequelize.json", "/app/config.yml", "/app/resource"]
EXPOSE 3000

CMD ["yarn", "run", "start"]
