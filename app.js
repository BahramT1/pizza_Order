const express = require('express');
const mariadb = require('mariadb')

const app = express();
const PORT = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Pakhtoon2002@',
    database: 'pizzas'
})

async function connect() {
    try{
    const conn = await pool.getConnection();
    console.log('connected to the database.');
    return conn;
    }catch (err) {
        console.log("Error connecting to DB: "+ err);
    }

};

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

// Test comment
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

// create a route for success page
app.post('/success', async(req, res) => {

    const data = req.body;
    console.log(data);

    const conn = await connect();

    await conn.query(`INSERT INTO orders (fname, lname, email, toppings, comment, method, size, discount)
        VALUES ('${data.fname}','${data.lname}','${data.email}','${data.toppings}','${data.comment}',
        '${data.method}','${data.size}','${data.discount}');`);

    

    /*
    fname: 'Bahram',
    lname: 'Totakhil',
    email: 'Bahramtotakhil5@gmail.com',
    method: 'delivery',
    toppings: [ 'pepperoni', 'olives', 'artichokes' ],
    size: 'large',
    comment: 'Make it fast',
    discount: 'on'
    */

    //res.send('Thank you!');
    res.render('confirmation', { details : data});
});

app.get('/orders', async (req, res) =>{
    const conn = await connect();

    const rows = await conn.query(`SELECT * FROM orders ORDER BY timestamp DESC`)
    res.render('order-summary', {data:rows});

});
