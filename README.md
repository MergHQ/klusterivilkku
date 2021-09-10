# Klusterivilkku

### Development

1. Install NodeJS
2. Install `yarn` with `npm install -g yarn`
3. Run `yarn` to install dependencies
4. Install docker, and run `docker-compose up -d` to spin up a postgreSQL database.
5. Migrate the database with `DATABASE_URL=postgres://postgres:password@localhost:5432/postgres yarn migrate:up`
6. Run `cp .env.example .env` and fill in the empty variables in `.env`.
7. In another terminal window, run `yarn watch-frontend`
8. In the main terminal window run `yarn dev-server`
9. Go to `http://localhost:3333`
