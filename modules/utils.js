const mysql = require('mysql');

module.exports = {
    createMysqlConnection: () => {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'secret',
            database: 'lab_six',
            port: '3333'
        });
    },

    sanitizeInput: (data, mysqlConnection) => {
        for (const key in data) {
            data[key] = mysqlConnection.escape(data[key]);
            data[key] = data[key].substring(1, data[key].length - 1);
        }

        return data;
    },
}