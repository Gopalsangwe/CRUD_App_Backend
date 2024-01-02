const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
//connection with database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gopal@1515',
    database: 'wpt'
});

connection.connect((err) => {
    if (err) {
        console.error("error in connectong", err)
        return;
    }
    else {
        console.log("connected to mysql");
    }
})


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Crud Operations will come here
//Retrive operation
app.get('/items', (req, res) => {
    const query = "select * from items";

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error in fetchign", error)
            res.status(500).json({ error: "Error in fetchinf items" })
        }
        else {
            res.status(200).json(results);
        }
    });
});
//Create Operation
app.post('/items', (req, res) => {

    const { id,name, price, quantity } = req.body;
    //query for creating record
    const query = "insert into items(id,name,price,quantity) values(?,?,?,?)";

    connection.query(query, [id,name, price, quantity], (error, results) => {
        if (error) {
            console.error("Error in creating item ", error)
            res.status(500).json({ error: "Error in creating item" })
        }
        else {
            res.status(201).json({ message: "item added succesfully", id: results.insertid });
        }
    })
})

//delete opeartion

app.delete('/items/:id', (req, res) => {
    const Id = req.params.id;
  
    const query = 'DELETE FROM items WHERE id = ?';
    connection.query(query, [Id], (error, result) => {
      if (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Error deleting item' });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Item not found' });
        } else {
          res.status(200).json({ message: 'Item deleted successfully' });
        }
      }
    });
  });
  
 //Update Operation
 // ... (previous backend code)

// Route to update an item in the 'items' table
app.put('/items', (req, res) => {
    //const itemId = req.params.id;
    const { name, price,  quantity, itemId } = req.body;
  
    const query = 'UPDATE items SET name = ?, price = ?, quantity = ? WHERE id = ?';
    connection.query(query, [name,  price,quantity, itemId], (error, result) => {
      if (error) {
        console.log(error)
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Error updating item' });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Item not found' });
        } else {
          res.status(200).json({ message: 'Item updated successfully' });
        }
      }
    });
  });
  
  // ... (rest of the backend code)
   
  


app.listen(3000, () => {
    console.log("Server is listening in port 3000");
})