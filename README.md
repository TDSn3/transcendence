```
└── transcendence
    ├── backend
    |    └── prisma/
    |    └── src/
    |    └── .env
    |    └── Dockerfile
    |    └── Dockerfile.studio
    |    └── ...
    ├── frontend
    |    └── public/
    |    └── src/
    |    └── Dockerfile
    |    └── index.html
    |    └── ...
    └── .env
    └── .gitignore
    └── docker-compose.yml
    └── Makefile
    └── README.md
```

## Usage

### `.env.private`

First, you must add a `.env.private` file to the root with these variables :

```
API_42_UID=<data>
API_42_SECRET=<data>
JWT_SECRET=<data>
JWT_REFRESH_SECRET=<data>
```

If you don't have access to 42 profiles, ignore the first two and log in with the fake user.

Next, run the `make` command and go to http://localhost:3000.

---

### Makefile

On `./`

- ` make ` : Creates and starts two containers. One with backend connected to port ` 5001 ` and another with frontend connected to port ` 3000 `.
- ` make ps ` :  View images, running containers, and volumes.
- ` make it_backend ` ` make it_frontend ` :  Enters the container in interactive mode.
- ` make start ` : Starts containers.
- ` make stop ` : Stops containers.
- ` make down ` : Stops and deletes containers and their images.
- ` make clean ` : Stops and deletes containers.
- ` make fclean ` : Stops and deletes **ALL** containers **(Note that this will delete all your other containers, if any)**.
- Other commands are available in the Makefile.

### Prisma

On `./backend/`

- `npx prisma migrate dev` : Load .env variable and create a network between my database and my backend.
- `npx prima migrate deploy`: Upload modifications.
- `npx prisma migrate dev --name name_migrate` : Creates a new migration with the specified name and applies it to the database.
- `npx prisma generate` : Generates or updates the Prisma client.
- `npx prisma studio` : Show the database in the navigator.

#### Scripts

- `npm run start:migrate:dev` : Runs `npx prisma migrate deploy` to apply the latest migrations to your database and  starts the development server with `nest start --watch`.

## Utils

### Resources

- full stack : https://fullstackopen.com/en/
- - ` Part 0 ` Fundamentals : https://fullstackopen.com/en/part0
- - ` Part 1 ` react : https://fullstackopen.com/en/part0
- - ` Part 2 ` react : https://fullstackopen.com/en/part0
- - ` Part 9 ` typeScript : https://fullstackopen.com/en/part0
- - ` Part 13 ` relational databases : https://fullstackopen.com/en/part0
- web socket : https://dev.to/delightfulengineering/nest-js-websockets-basics-35b8
- prisma :
- - https://www.prisma.io/docs/orm/prisma-schema/overview
- - https://www.prisma.io/docs/concepts/database-connectors/postgresql

### VS Code extension

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
