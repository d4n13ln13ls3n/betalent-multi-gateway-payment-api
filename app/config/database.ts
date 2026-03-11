import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: env.get('DB_CONNECTION') as 'mysql',

  connections: {
    mysql: {
      client: 'mysql2',

      connection: {
        host: env.get('DB_HOST') as string,
        port: Number(env.get('DB_PORT')),
        user: env.get('DB_USER') as string,
        password: env.get('DB_PASSWORD') as string,
        database: env.get('DB_DATABASE') as string,
      },

      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },

      debug: app.inDev,
    },
  },
})

export default dbConfig