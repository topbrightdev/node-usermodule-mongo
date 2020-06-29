const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
// const {swaggerDocument} = require('./swagger.js');
const router = require('./src/routes/note.routes.js');
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

// parse requests of content-type - application/json
app.use(bodyParser.json())
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
// app.get('/', (req, res) => {
//     res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
// });
// Require Notes routes
require('./src/routes/note.routes.js')(app);

app.use('/api/v1', require('./src/routes/note.routes.js'));
// listen for requests
app.listen(3010, () => {
    console.log("Server is listening on port 3010");
});
