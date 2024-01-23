# transcendence

```
└── transcendence
    ├── backend
    |    └── Dockerfile
    |    └── ...
    ├── frontend
    |    └── Dockerfile
    |    └── ...
    └── .env
    └── .gitignore
    └── docker-compose.yml
    └── Makefile
    └── README.md
```

## Usage

- ` make ` : Creates and starts two containers. One with backend connected to port ` 5001 ` and another with frontend connected to port ` 3000 `.
- ` make ps ` :  View images, running containers, and volumes.
- ` make it_backend ` ` make it_frontend ` :  Enters the container in interactive mode.
- ` make start ` : Starts containers.
- ` make stop ` : Stops containers.
- ` make down ` : Stops and deletes containers and their images.
- ` make clean ` : Stops and deletes containers.
- ` make fclean ` : Stops and deletes **ALL** containers **(Note that this will delete all your other containers, if any)**.
- Other commands are available in the Makefile.

## Ressources

- https://fullstackopen.com/en/
- - ` Part 0 ` Fundamentals : https://fullstackopen.com/en/part0
- - ` Part 1 ` react : https://fullstackopen.com/en/part0
- - ` Part 2 ` react : https://fullstackopen.com/en/part0
- - ` Part 9 ` typeScript : https://fullstackopen.com/en/part0
- - ` Part 13 ` relational databases : https://fullstackopen.com/en/part0
