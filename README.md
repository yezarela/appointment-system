# appointment-system

Appointment scheduling system that supports creating, viewing, and cancelling appointments.

## Prerequisites

- Install [Node.js v20.x](https://nodejs.org/en/download/package-manager)
- Install [Nest CLI](https://docs.nestjs.com/cli/overview)

## Installation

```bash
$ yarn install
```

## Running the app

For first time run, you'll need to run the migrations:

```bash
# run all pending migrations
yarn migration:run
```

And you can run the app:

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test
```

## Development

```bash
# generate migration based on entity changes
yarn migration:generate migrations/<migration-name>
```
