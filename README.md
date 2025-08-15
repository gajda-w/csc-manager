# Hono/JSX + Vite

Author: [@MathurAditya724](https://github.com/MathurAditya724)

This example shows how to use Hono's
[jsx-dom](https://hono.dev/docs/guides/jsx-dom) with Vite and integrate it with
the Hono API.

## Commands

Install app

```bash
# npm run dev
deno install --allow-scripts
```

Run dev server

```bash
# npm run dev
deno task dev
```

Building

```bash
# npm run build
deno task build
```

Install [dvm](https://github.com/justjavac/dvm)

$ dvm use

$ deno task dev

$ deno install npm:lib -D

$ deno install npm:lib

$ deno install --allow-scripts

## [Localstack](https://www.localstack.cloud/)

Localstack is used for local development to replace need of usage AWS services.
Everything needed is automatically configured on container startup.

### Running localstack

To run localstack in the background:

```
$ docker compose up localstack -d
```

On startup:

- secret manager value will be created ($SECRET_MANAGER_APP_CONFIG_PATH env)

Check the [init-aws.sh](/etc/init-aws.sh) script for more details.

### Helpful commands:

Requires [awscli-local](https://github.com/localstack/awscli-local), to install:

```
$ brew install awscli-local
```

or

```
$ pip3 install awscli-local
```

#### Reading secretsmanager config value:

```
$ awslocal secretsmanager --region ap-southeast-1 get-secret-value --secret-id ts-boilerplate
```
