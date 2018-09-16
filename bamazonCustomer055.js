var mysql = require('mysql');
var inquirer = require('inquirer');
var keys = require("./keys.js"); 

//Creates connection info
var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"rootpass",
    database:"bamazon_DB"
});

//Opens connection to the mysql server and the sql database 
connection.connect(function(err) { 
    if (err) throw err; 
}); 

queryAllBamazon(itemMenu); 
//THIS FUNCTION BELOW PROMPTS USERS FOR WHAT ACTION THEY SHOULD TAKE

var dataDB = [];

//Queries DB and fetches all records, storing each as an Object inside of an Array.
function queryAllBamazon(callback) {
    console.log("Fetching Records...");

    

    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        dataDB[i] = {
            productID : res[i].id,
            productName : res[i].product_name,
            deptName : res[i].department_name,
            productCost : res[i].price,
            stockQuantity : res[i].stock_quantity
        }
    }
    
    console.log("Record Information Obtained!");

    callback();
    });

}

function displayStoredRecords(mode) {
    if (mode) {
        //display desired record
        console.log("\n");
        console.log("ID | Item Name | DPRMNT | Price | Stock ");
        console.log(dataDB[mode].productID + " | " + dataDB[mode].productName + " | " + dataDB[mode].deptName + " | " + dataDB[mode].productCost + " | " + dataDB[mode].stockQuantity);
    } else {
        //display all records
        console.log("\n");
        console.log("ID | Item Name | DPRMNT | Price | Stock ");
        for (var i = 0; i < dataDB.length; i++) {
            console.log(dataDB[i].productID + " | " + dataDB[i].productName + " | " + dataDB[i].deptName + " | " + dataDB[i].productCost + " | " + dataDB[i].stockQuantity);
        }    
    }
}
var itemMenuChoices = function() {
    var foo = [];
    for (i = 0; i < dataDB.length; i++){
        foo.push({
            name: dataDB[i].productName, 
            value: i
        });
    }
    return foo
}

var questions = [
    {
        name: "wannaBuy", 
        type: "list",
        message: "Select the item that you would like to purchase:",
        choices: itemMenuChoices
    },
    {
        name: "howMany", 
        type: "input", 
        message: "Enter the number that you would like to purchase:",
    }
]

function itemMenu() {
    console.log("\n");
    //console.log("ID | Item Name | DPRMNT | Price | Stock ");
    inquirer.prompt(questions)
    .then(function(answers){
        updateStore(answers.wannaBuy, answers.howMany);  
    }); 
}

function updateStore(itemID, desiredQTY) {
    dataDB[itemID].stockQuantity -= desiredQTY;
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: dataDB[itemID].stockQuantity
            },
            {
                id: dataDB[itemID].productID
            }
        ],
    function(error) {
        if (error) throw err;
       console.log("Purchased " + desiredQTY + " of " + dataDB[itemID].productName + " successfully!");
       console.log(dataDB[itemID])
    }
    )
    
}


function exit() {
    console.log("Thank you, come again!"); 
    connection.end(); 
}

function doNext() {
    inquirer.prompt({
        name: "selectNext",
        type: "confirm",
        message: "Would you like to make another purchase[ Y / N ]?",
        default: true
    })
    .then(function(answers){
        if (answers.selectNext) {
            //Do another Purchase
            // start();
            queryAllBamazon();
        } else {
            //Exit Bamazon
            exit();
        }
    });
}

function failure() { console.log("Something has gone awry..."); }


// connection.query("SELECT * FROM products WHERE id = ?", [answers.wannaBuy], function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
//     }
//   });

/*******************************************

var userId = 1;
var columns = ['username', 'email'];
var query = connection.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userId], function (error, results, fields) {
  if (error) throw error;
  // ...
});
 
console.log(query.sql); // SELECT `username`, `email` FROM `users` WHERE id = 1

*********************************************/