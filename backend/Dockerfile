FROM		node:21.6.0

RUN			npm install -g @nestjs/cli

WORKDIR		/usr/src/app
COPY		. /usr/src/app

EXPOSE		5000

CMD			["tail", "-f", "/dev/null"]
