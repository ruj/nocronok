const {
  DATABASE_DOMAIN,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT
} = process.env

process.stdout.write(
  `mysql://root:${DATABASE_PASSWORD}@${!process.argv[2] ? DATABASE_DOMAIN : process.argv[2]}:${DATABASE_PORT}/${DATABASE_NAME}`
)
