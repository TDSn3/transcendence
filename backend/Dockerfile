FROM		node:21.6.0 

RUN			npm install -g @nestjs/cli

WORKDIR		/usr/src/app

COPY		. /usr/src/app

RUN			npm install

EXPOSE		5000

CMD			["npm", "start"]
