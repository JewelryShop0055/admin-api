## Prerequired

- postgres 14
- 한국어 형태소 분석기: https://github.com/i0seph/textsearch_ko
- Aws S3 or S3 protocol service
- keycloak

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
