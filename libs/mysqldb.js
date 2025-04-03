import mysql from 'mysql'

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fitbod'
})
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fitbod'
});

export const connectDbMySql = async () => {
    try {
        conn.connect(function (err) {
            if (err) throw err;
        });

        console.log("Connected to mysql");


        pool.query('SELECT * from user', function (error, results, fields) {
            if (error) throw error;
            console.log('The result is: ', results);
        });


    } catch (error) {
        console.log(`Error connecting to MongoDb, ${error}`);
        process.exit(1)
    }
}