const express = require('express');
const utils = require('../modules/utils');

const app = express();
const port = 6001;
const mysqlConnection = utils.createMysqlConnection();

// Strings
const endPointRoot = '/COMP4537/labs/6/api/v1/';
const sqlSelectAllLangs = 'SELECT name FROM language';
const sqlInsertEntry = 'INSERT INTO entry (word, definition, word_language, definition_language) VALUES (?, ?, ?, ?)';
const sqlSelectEntry = 'SELECT * FROM entry WHERE word = ?';
const sqlUpdateEntry = 'UPDATE entry SET definition = ? WHERE word = ?';
const sqlSelectCountEntry = 'SELECT COUNT(*) FROM entry';
const sqlDeleteEntry = 'DELETE FROM entry WHERE word = ?';
const notFoundEntry = 'Entry not found';
const foundEntry = 'Entry found successfully';
const updateEntry = 'Entry updated successfully';
const addEntry = 'Entry added successfully';
const deleteEntry = 'Entry deleted successfully';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE');
    res.header('Content-Type', 'application/json');
    next();
});

app.get(`${endPointRoot}languages`, (req, res) => {
    mysqlConnection.query(sqlSelectAllLangs, (err, result) => {
        if (err) throw err;
        res.status(200).end(JSON.stringify(result));
    });
});

app.get(`${endPointRoot}definition/:word`, (req, res) => {
    const data = utils.sanitizeInput(req.params, mysqlConnection);

    mysqlConnection.query(sqlSelectEntry, [data.word], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            res.status(404).end(JSON.stringify({ message: notFoundEntry, entry: { word: data.word } }));
            return;
        }

        delete result[0].id;
        res.status(200).end(JSON.stringify({ message: foundEntry, entry: result[0] }));
    });
});

app.patch(`${endPointRoot}definition/:word`, (req, res) => {
    let body = '';

    req.on('data', chunk => {
        if (chunk !== null) {
            body += chunk;
        }
    });

    req.on('end', () => {
        const dataBody = utils.sanitizeInput(JSON.parse(body), mysqlConnection);
        const dataParams = utils.sanitizeInput(req.params, mysqlConnection);
        const responseData = {};

        const promise = new Promise((resolve, reject) => {
            mysqlConnection.query(sqlUpdateEntry, [dataBody.definition, dataParams.word], (err, result) => {
                if (err) reject(err);
                resolve(result)
            });
        });

        promise.then((result) => {
            if (result.affectedRows === 0) {
                throw new Error(notFoundEntry);
            }
            responseData.message = updateEntry;
            responseData.entry = { word: dataParams.word, definition: dataBody.definition };
            res.status(200);
        }).catch(err => {
            responseData.message = err.sqlMessage ?? err.message;
            responseData.entry = { word: dataParams.word ?? '', definition: dataBody.definition ?? '' };
            res.status(404);
        }).finally(() => {
            mysqlConnection.query(sqlSelectCountEntry, (err, result) => {
                if (err) throw err;
                res.end(JSON.stringify({ message: responseData.message, entry: responseData.entry, total: result[0]['COUNT(*)'] }));
            });
        });
    });
});

app.post(`${endPointRoot}definition`, (req, res) => {
    let body = '';

    req.on('data', chunk => {
        if (chunk !== null) {
            body += chunk;
        }
    });

    req.on('end', () => {
        const data = utils.sanitizeInput(JSON.parse(body), mysqlConnection);
        const responseData = {};

        const promise = new Promise((resolve, reject) => {
            mysqlConnection.query(sqlInsertEntry, [data.word, data.definition, data.wordLang, data.definitionLang], (err) => {
                if (err) reject(err);
                resolve()
            });
        });

        promise.then(() => {
            responseData.message = addEntry;
            responseData.entry = { word: data.word, definition: data.definition, wordLang: data.wordLang, definitionLang: data.definitionLang };
            res.status(201);
        }).catch(err => {
            responseData.message = err.sqlMessage;
            responseData.entry = { word: data.word ?? '', definition: data.definition ?? '', wordLang: data.wordLang ?? '', definitionLang: data.definitionLang ?? '' };
            res.status(400);
        }).finally(() => {
            mysqlConnection.query(sqlSelectCountEntry, (err, result) => {
                if (err) throw err;
                res.end(JSON.stringify({ message: responseData.message, entry: responseData.entry, total: result[0]['COUNT(*)'] }));
            });
        });
    });
});

app.delete(`${endPointRoot}definition/:word`, (req, res) => {
    const data = utils.sanitizeInput(req.params, mysqlConnection);
    const responseData = {};

    const promise = new Promise((resolve, reject) => {
        // Attempt to delete the entry
        mysqlConnection.query(sqlDeleteEntry, [data.word], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });

    promise.then((result) => {
        if (result.affectedRows === 0) {
            // Entry not found, respond with an appropriate message
            responseData.message = notFoundEntry;
            responseData.entry = { word: data.word };
            res.status(404);
        } else {
            // Entry deleted successfully
            responseData.message = deleteEntry;
            responseData.entry = { word: data.word };
            res.status(200);
        }
    }).catch(err => {
        // Handle any errors, such as database errors
        responseData.message = err.sqlMessage ?? err.message;
        responseData.entry = { word: data.word ?? '' };
        res.status(500); // Use an appropriate HTTP status code for database errors
    }).finally(() => {
        // Return the response
        mysqlConnection.query(sqlSelectCountEntry, (err, result) => {
            if (err) throw err;
            res.end(JSON.stringify({ message: responseData.message, entry: responseData.entry, total: result[0]['COUNT(*)'] }));
        });
    });
});


app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening at port ${port}`);
});