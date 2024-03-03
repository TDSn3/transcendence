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

## BACKEND

- GET : Utilisé pour récupérer des données du serveur. Les données sont incluses dans l'URL.Les données sont incluses dans l'URL en tant que paramètres de requête. Par exemple, ?key1=value1&key2=value2. La quantité de données qu'une requête GET peut envoyer est limitée en raison des restrictions d'URL. Elle est généralement utilisée pour des requêtes sans effet de bord. 

- POST : Utilisé pour soumettre des données au serveur pour traitement. Les données sont incluses dans le corps de la requête. (ex: mail et mdp). Les données ne sont pas incluses dans l'URL, mais plutôt dans le corps de la requête. Peut envoyer un volume plus important de données car les données sont dans le corps de la requête. Souvent utilisé pour les opérations qui modifient l'état du serveur.

- Un DTO (Data Transfer Object) est un objet qui permet de transférer des données entre les différentes parties d'une application. Dans le contexte des applications web, les DTO sont souvent utilisés pour représenter les données transportées entre le client et le serveur. 
Aussi, cela elimine la nécessité de répéter la structure des données dans plusieurs parties du code. La DTO sert de documentation aussi.

- Prisma est utilisé comme un ORM (Object-Relational Mapping) pour interagir avec la base de données. Prisma simplifie l'accès et la manipulation des données de la base de données en permettant aux développeurs d'écrire des requêtes en utilisant une syntaxe de programmation plutot que du SQL brut.
    - Configuration de Prisma Model:
        - Schema.prisma ou on specifie la connexion avec la base de donnees, de modeles de donnees.
    - Init PrismaService
    - Operation CRUD avec la base de donnees:
        - On utilise Prisma pour effectuer des opérations de lecture et d'écriture dans la base de données. Par exemple, prisma.user.findUnique est utilisé pour rechercher un utilisateur unique en fonction de l'adresse e-mail.
        - De plus, prisma.user.update et prisma.user.create sont utilisé mettre à jour ou créer un utilisateur, respectivement.
    - Le SQL brut serait comme tel:
    ```sql
        // Exemple de création de table avec du SQL brut
        await db.none(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email42 VARCHAR(255) NOT NULL,
                intraId INT,
                login VARCHAR(255)
            );
        `);
    ```
    et au lieu de ma fonction principale 'save_data', en sql brut cela donnerait:
    ```Typescript
            async saveUserData(userData: any): Promise<void> {
            try {
                const user = await db.oneOrNone(
                    'SELECT * FROM users WHERE email42 = $1',
                    [userData.email]
                );

                if (user) {
                    await db.none(
                        'UPDATE users SET intraId = $1, login = $2 WHERE email42 = $3',
                        [userData.id, userData.login, userData.email]
                    );
                } else {
                    await db.none(
                        'INSERT INTO users (intraId, email42, login) VALUES ($1, $2, $3)',
                        [userData.id, userData.email, userData.login]
                    );
                }
            } catch (error) {
                console.error('Error saving user data:', error);
                throw error;
            }
        }
    ```

- Swagger:
    - framework open-source qui simplifie la création, la conception, la documentation et la consommation des services web RESTful. Dans le contexte de NestJS (ou d'autres frameworks), Swagger peut être intégré pour générer une documentation interactive basée sur les annotations dans le code.

# PRISMA USAGE

`npx prisma migrate dev` : load .env variable and create a network between my database and my backend
`npx prima migrate deploy`: upload modifications 
`npx prisma studio` : debug the database

If you test the database on local, you'll have to 

- Run ONLY the database on the docker-compose, so comment frontend and backend service
- comment off on "/backend/.env" DATABASEURL="...db:5432" and comment on DATABASEURL="...localhost:5432...".
- Run locally frontend and backend

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

## VS Code extension

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Note

``` mermaid
sequenceDiagram

    %% Login FakeUser 
	note over front: /login
    rect rgb(220, 220, 255)
    note over front: <Login>
    note over front: handleClick() <br/><br/> userServices <br/> .addFakeUser()
    end
    front->>back: POST /api/auth/FakeUsers
    note over back: AuthModule
    note over back: authService <br/> .fakeUsers() <br/> .saveUserData()
    back->>database: create or update user
    database-->>back: user data
    note over back: authService <br/> .generateToken()
    back-->>front: user data
    rect rgb(220, 220, 255)
    note over front: setUser(user) <br/><br/> setLoggedIn(true) <br/><br/> localStorage.setItem() <br/><br/> navigate('/home')
    end
    note over front: /home
    note over front: <Navbar> <Home>

    %% Logout
    note over front: <Navbar>
    rect rgb(220, 220, 255)
    note over front: <Logout>
    note over front: authServices <br/> .logoutUser()
    end
    front->>back: POST /api/auth/logout
    note over back: AuthModule
    note over back: authService <br/> .logout()
    back->>database: change user status to OFFLINE
    database-->>back: user data
    back-->>front: response
    rect rgb(220, 220, 255)
    note over front: setLoggedIn(false) <br/><br/> localStorage.removeItem() <br/><br/> navigate('/')
    end
    note over front: /login
    note over front: <Login>

```
