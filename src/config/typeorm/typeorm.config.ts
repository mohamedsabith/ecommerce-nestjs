module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrationsTableName: 'migrations',
  migrations: [
    __dirname + '/migration/**/*.ts',
    __dirname + '/migration/**/*.js',
  ],
  synchronize: true,
  autoLoadEntities: true,
  logging: ['error'],
  migrationsRun: process.env.RUN_MIGRATIONS,
  cli: {
    migrationsDir: 'src/migrations',
  },
};
