# transcendence

```
└── transcendence
    ├── backend
    |    └── /prisma
    |    └── /src
    |    └── .env
    |    └── Dockerfile
    |    └── Dockerfile.studio
    |    └── ...
    ├── frontend
    |    └── /public
    |    └── /src
    |    └── .env
    |    └── Dockerfile
    |    └── index.html
    |    └── ...
    └── .gitignore
    └── docker-compose.yml
    └── Makefile
    └── README.md
```

## Usage

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

- `npx prisma migrate dev` : load .env variable and create a network between my database and my backend.
- `npx prima migrate deploy`: upload modifications.
- `npx prisma studio` : debug the database.
- `npx prisma migrate dev --name name_migrate`.
- `npx prisma generate`.

#### Scripts

- `npm run start:migrate:dev` : Runs `npx prisma migrate deploy` to apply the latest migrations to your database and  starts the development server with `nest start --watch`.

### Run locally

If you test the project without docker for the backend and frontend, you'll have to :

- Run ONLY the database on the docker-compose, so comment frontend and backend service.
- on `/backend/.env`, on the line `DATABASEURL=`, comment off `"<...>db:5432"` and comment on `"<...>localhost:5432<...>"`.
- Run locally frontend and backend.

#### Backend

On `./backend/`

- `npm run start:dev`

#### Frontend

On `./frontend/`

- `npm run dev`

## Utils

### Resources

- full stack : https://fullstackopen.com/en/
- - ` Part 0 ` Fundamentals : https://fullstackopen.com/en/part0
- - ` Part 1 ` react : https://fullstackopen.com/en/part0
- - ` Part 2 ` react : https://fullstackopen.com/en/part0
- - ` Part 9 ` typeScript : https://fullstackopen.com/en/part0
- - ` Part 13 ` relational databases : https://fullstackopen.com/en/part0
- web socket : https://dev.to/delightfulengineering/nest-js-websockets-basics-35b8

### VS Code extension

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
