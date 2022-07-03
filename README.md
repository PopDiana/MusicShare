## Database setup

Run migrations and seed data with:

`npx sequelize-cli db:migrate`
`npx sequelize-cli db:seed:all`

Undo seed and migrations:

`npx sequelize-cli db:seed:undo:all`
`npx sequelize-cli db:migrate:undo:all`

## Run project
 In the project root folder:
 
`npm install`

- Node.js API:

```
cd backend
npm run start:development
```

- React App:

```
cd frontend
npm start
```

