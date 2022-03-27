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


## Configuration
 copy to `src/configure/config.yml`(devleop or standalon) or `/app/configure/config.yml` (use docker) from `config.sample.yml`

### app
```yaml
app:
  port: 3001
```
 * `port` (optional, default: 3001 ): litens port

### db
```yaml
db:
  allowSync: false
  initKorDic: false
  config: 
    dialect: postgres
    dialectOptions:
      autoJsonMap: false
    database: raviluz
    username: postgres
    password: postgres
    host: postgres
    port: 5432
```
 * `allowSync` (optional, default: false): db 동기화 사용 여부
 * `initKorDic` (optional, default: false): 한국어 형태소 관련 쿼리 실행 여부(최초 1회 필요)

 * config: 
  
  > `SequelizeOptions` 타입에 관한 부분입니다.
  >
  > 관련 문서: 
  >  * [sequelize-typescript npm page](https://www.npmjs.com/package/sequelize-typescript#configuration)
  > * [sequelzie api document](https://sequelize.org/v6/class/src/sequelize.js~Sequelize.html#instance-constructor-constructor)

 > Postgres 이외의 

### aws
```yaml
aws:
  signatureVersion: v4
  region: ap-northeast-2
  bucketName: dev
  s3Endpoint: http://minio:9000
  accessKeyId: access key
  secretAccessKey: secret key
```

 * `signatureVersion` (optional) : aws api version.
 * `region` (required): : aws region
 * `bucketName` (required): 이미지 리소스 저장 버킷
 * `s3Endpoint`  (optional): AWS가 아닌 셀프 호스트 서비스를 사용할 때 필요. (예, [minio](https://min.io/) )
 * `accessKeyId`: aws accessKeyId
 * `secretAccessKey`: aws secretAccessKey

### keycloak
```yaml
keycloak:
  authServerUrl: http://keycloak:8080/auth
  realm: raviluz
  clientId: admin-api
  secret: 318ce042-8f42-42f1-965c-88f3c48c0e7d
```
 > `KeycloakConnectOptions` 타입에 관한 부분입니다.
 >
 > 관련 문서: 
 > * [nest-keycloak-connect](https://www.npmjs.com/package/nest-keycloak-connect#user-content-configuration-options)


 * `authServerUrl` (required) : keycloak address
 * `realm` (required) : realm name
 * `clientId` (required): client id
 * `secret` (required): client secret

