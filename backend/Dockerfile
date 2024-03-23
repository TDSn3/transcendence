FROM	node:21.6.0

RUN		npm install -g @nestjs/cli

WORKDIR	/usr/src/app
COPY	. /usr/src/app

RUN		npm install && npx prisma generate

CMD		[ "npm", "run", "start:migrate:dev" ]
