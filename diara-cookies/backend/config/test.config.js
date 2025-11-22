export default {
  test: {
    db: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: parseInt(process.env.TEST_DB_PORT) || 5433, // Gunakan port berbeda untuk testing
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_NAME || 'diara_cookies_test',
    },
    app: {
      port: parseInt(process.env.TEST_PORT) || 3001,
    }
  }
};