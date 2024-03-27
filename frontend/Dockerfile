FROM		node:21.6.0

WORKDIR		/usr/src/app
COPY		. /usr/src/app

RUN			chmod +x /usr/src/app/script.sh		\
				&& npm install -g serve			\
				&& npm install

ENTRYPOINT	["/usr/src/app/script.sh"]

CMD			["serve", "-s", "dist"]
