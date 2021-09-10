# Klusterivilkku

### Development

1. Install NodeJS
2. Install `yarn` with `npm install -g yarn`
3. Run `yarn` to install dependencies
4. Install docker, and run `docker-compose up -d` to spin up a postgreSQL database.
5. Migrate the database with `DATABASE_URL=postgres://postgres:password@localhost:5432/postgres yarn migrate:up`
6. In another terminal window, run `yarn watch-frontend`
7. In the main terminal window run `yarn dev-server`
8. Go to `http://localhost:3333`
