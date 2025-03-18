# DkStore

[![license mit](https://img.shields.io/badge/licence-MIT-7c3aed)](/LICENSE)
[![Built with dkcutter-nextjs](https://img.shields.io/badge/built%20with-DKCutter%20NextJs-7c3aed.svg)](https://github.com/dkshs/dkcutter-nextjs)

An e-commerce with Turborepo, Next.Js, BullMQ and React Email.

## Install and run the project

### Global Dependencies

You need to have a main dependency installed:

- Node.js LTS v18 (or any higher version)

Do you use `nvm`? Then you can run `nvm install` in the project folder to install and use the most appropriate version of Node.js.

### Get the repository

```bash
git clone https://github.com/dkshs/dkstore.git
```

### Local Dependencies

So after getting the repository, don't forget to install the project's local dependencies:

```bash
pnpm install
```

### Environment variables

Create a `.env` file similar to [`.env.example`](./.env.example).

```dotenv
# When adding additional environment variables, the schema in "./src/env.js"
# should be updated accordingly.

# ------ POSTGRES ENV ------
# Postgres
POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgresw"

# ------ PROJECT ENV ------
# Database (Prisma)
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/postgres"

JWT_SECRET="my_jwt_secret"

# these variables are used for the site's SEO
SITE_NAME="DkStore"
SITE_LOCALE="en_US"
# URLs
SITE_BASEURL="http://localhost:3000" # in PROD put the URL of your project

NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Run the project

To run the project locally, just run the command below:

```bash
pnpm dev
```

- go to <http://localhost:3000> to see the application.

## License

This project is licensed under the **MIT** License - see the [LICENSE](./LICENSE) file for details.
