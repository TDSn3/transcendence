FROM		node:21.6.0

WORKDIR		/usr/src/app
COPY		. /usr/src/app

RUN			npm install

RUN			npm run build

CMD			["npm", "run", "dev"]
