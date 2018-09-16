var mysql = require('mysql');
var inquirer = require('inquirer');
var keys = require("./keys.js"); 

//create connection 
var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user:"root",
    password:"rootpass",
    database:"bamazon_DB"
});

//connecting to the mysql server and the sql database 
connection.connect(function(err) { 
    if (err) throw err; 
    //start(); //changed from start LOOK AT THIS ERIC
    //console.log("connected as id " + connection.threadId);
    queryAllBamazon(); 
    //start(); 
}); 

//THIS FUNCTION BELOW PROMPTS USERS FOR WHAT ACTION THEY SHOULD TAKE

function queryAllBamazon() {
    console.log("\n");
    console.log("ID | Item Name | DPRMNT | Price | Stock ");
    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      }
      console.log("-----------------------------------");
      start();
      //console.log("Hit any key to continue")
    });
  }

  function queryExactBamazon(answers) {
    console.log("\n");
    console.log("ID | Item Name | DPRMNT | Price | Stock ");
    connection.query("SELECT * FROM products WHERE id = ?", [answers.wannaBuy], function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      }
    //   console.log("-----------------------------------");
    //   console.log("Hit any key to continue")
    });
  }

/*******************************************

var userId = 1;
var columns = ['username', 'email'];
var query = connection.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userId], function (error, results, fields) {
  if (error) throw error;
  // ...
});
 
console.log(query.sql); // SELECT `username`, `email` FROM `users` WHERE id = 1

*********************************************/

var questions = [
    {
        name: "wannaBuy", 
        type: "input", 
        message: "Enter the ID of the item that you would like to purchase:",
    },
    {
        name: "howMany", 
        type: "input", 
        message: "Enter the number that you would like to purchase:",
    }
]

function failure() { console.log("Something has gone awry..."); }

function start() {
    inquirer.prompt(questions)
    .then(function(answers){
        
        console.log("\n");
        //console.log("ID | Item Name | DPRMNT | Price | Stock ");
        connection.query("SELECT * FROM products WHERE id = ?", [answers.wannaBuy], function(err, res) {
          
          if ( answers.howMany <= res[0].stock_quantity ){
              var remaining = res[0].stock_quantity - answers.howMany;
            
            console.log(remaining);
              
              

            //   connection.query("SELECT * FROM products WHERE id = ?", [answers.wannaBuy], function(err, res){
            //       console.log(res[0].id + " | " + res[0].product_name + " | " + res[0].department_name + " | " + res[0].price + " | " + res[0].stock_quantity);
            //   });

              doNext();
          } else {
              console.log("I'm sorry, but there is not enough of " + res[0].product_name + " in stock to fulfill that request");
              console.log("There are only " + res[0].stock_quantity + " of " + res[0].product_name +  " remaining in stock.")
              doNext();
          }

        });
    }); 
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
            start();
        } else {
            //Exit Bamazon
            exit();
        }
    });
}

function updateDB(){
    connection.query("UPDATE productas SET ? WHERE ?",
        [
          {
            stock_quantity: res[0].stock_quantity - answers.howMany
          },
          {
            id: res[0].id
          }
        ],
        function(error) {
          if (error) throw err;
          console.log("Purchased " + answers.howMany + "of " + res[0].product_name + "successfully!");
        }
    )
    .then(function(answers){
            
    });

}


