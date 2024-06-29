# DkStore

[![license mit](https://img.shields.io/badge/licence-MIT-7c3aed)](/LICENSE)
[![Built with dkcutter-nextjs](https://img.shields.io/badge/built%20with-DKCutter%20NextJs-7c3aed.svg)](https://github.com/dkshs/dkcutter-nextjs)

An e-commerce with Next.js.

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
```

### Run the project

To run the project locally, just run the command below:

```bash
pnpm dev
```

- go to <http://localhost:3000> to see the application.

## License

This project is licensed under the **MIT** License - see the [LICENSE](./LICENSE) file for details.
