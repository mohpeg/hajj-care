require('dotenv').config();

module.exports = {
  development: {
    username: 'sa',
    password: 'P@ssw0rd',
    database: 'hajjcare',
    host: '127.0.0.1',
    port: 1433,
    dialect: 'mssql',
    logging: console.log,
    benchmark: true,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
  },
  production: {
    // زي ما تحب، إما نفس الفكرة أو البيانات تفصيلية
    username: 'sa',
    password: 'P@ssw0rd',
    database: 'hajjcare_prod',
    host: '127.0.0.1',
    port: 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
    logging: false,
  },
};
