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


// function which prompts the user for what action they should take
function start() {
    inquirer
        .prompt({
        name: "postOrBid",
        type: "rawlist",
        message: "Would you like to [POST] an auction or [BID] on an auction?",
        choices: ["POST", "BID"]
        })
        .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.postOrBid.toUpperCase() === "POST") {
            postAuction();
        }
        else {
            bidAuction();
        }
        });
}

// function to handle posting new items up for auction
function postAuction() {
// prompt for info about the item being put up for auction
inquirer
    .prompt([
    {
        name: "item",
        type: "input",
        message: "What is the item you would like to submit?"
    },
    {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
    },
    {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
        if (isNaN(value) === false) {
            return true;
        }
        return false;
        }
    }
    ])
    .then(function(answer) {
    // when finished prompting, insert a new item into the db with that info
    connection.query(
        "INSERT INTO auctions SET ?",
        {
        item_name: answer.item,
        category: answer.category,
        starting_bid: answer.startingBid,
        highest_bid: answer.startingBid
        },
        function(err) {
        if (err) throw err;
        console.log("Your auction was created successfully!");
        // re-prompt the user for if they want to bid or post
        start();
        }
    );
    });
}

function bidAuction() {
// query the database for all items being auctioned
connection.query("SELECT * FROM auctions", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
    .prompt([
        {
        name: "choice",
        type: "rawlist",
        choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].item_name);
            }
            return choiceArray;
        },
        message: "What auction would you like to place a bid in?"
        },
        {
        name: "bid",
        type: "input",
        message: "How much would you like to bid?"
        }
    ])
    .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
        if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
        }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
        // bid was high enough, so update db, let the user know, and start over
        connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
            {
                highest_bid: answer.bid
            },
            {
                id: chosenItem.id
            }
            ],
            function(error) {
            if (error) throw err;
            console.log("Bid placed successfully!");
            start();
            }
        );
        }
        else {
        // bid wasn't high enough, so apologize and start over
        console.log("Your bid was too low. Try again...");
        start();
        }
    });
});
}
















// queryAllBamazon(displayStoredRecords); 
// //THIS FUNCTION BELOW PROMPTS USERS FOR WHAT ACTION THEY SHOULD TAKE

// var dataDB = [];

// //Queries DB and fetches all records, storing each as an Object inside of an Array.
// function queryAllBamazon(callback) {
//     console.log("Fetching Records...");

    

//     connection.query("SELECT * FROM products", function(err, res) {
//       for (var i = 0; i < res.length; i++) {
//         dataDB[i] = {
//             productID : res[i].id,
//             productName : res[i].product_name,
//             deptName : res[i].department_name,
//             productCost : res[i].price,
//             stockQuantity : res[i].stock_quantity
//         }
//     }
    
//     console.log("Record Information Obtained!");

//     callback();
//     });

// }

// function displayStoredRecords(mode) {
//     if (mode) {
//         //display desired record
//         console.log("\n");
//         console.log("ID | Item Name | DPRMNT | Price | Stock ");
//         console.log(dataDB[mode].productID + " | " + dataDB[mode].productName + " | " + dataDB[mode].deptName + " | " + dataDB[mode].productCost + " | " + dataDB[mode].stockQuantity);
//     } else {
//         //display all records
//         console.log("\n");
//         console.log("ID | Item Name | DPRMNT | Price | Stock ");
//         for (var i = 0; i < dataDB.length; i++) {
//             console.log(dataDB[i].productID + " | " + dataDB[i].productName + " | " + dataDB[i].deptName + " | " + dataDB[i].productCost + " | " + dataDB[i].stockQuantity);
//         }    
//     }
// }

// var questions = [
//     {
//         name: "wannaBuy", 
//         type: "input", 
//         message: "Enter the ID of the item that you would like to purchase:",
//     },
//     {
//         name: "howMany", 
//         type: "input", 
//         message: "Enter the number that you would like to purchase:",
//     }
// ]

// function itemMenu() {
//     console.log("\n");
//     //console.log("ID | Item Name | DPRMNT | Price | Stock ");
//     inquirer.prompt(questions)
//     .then(function(answers){
        
        
//     }); 
      
// }


// function exit() {
//     console.log("Thank you, come again!"); 
//     connection.end(); 
// }

// function doNext() {
//     inquirer.prompt({
//         name: "selectNext",
//         type: "confirm",
//         message: "Would you like to make another purchase[ Y / N ]?",
//         default: true
//     })
//     .then(function(answers){
//         if (answers.selectNext) {
//             //Do another Purchase
//             // start();
//             queryAllBamazon();
//         } else {
//             //Exit Bamazon
//             exit();
//         }
//     });
// }

// function failure() { console.log("Something has gone awry..."); }

// function updateDB(){
//     connection.query("UPDATE productas SET ? WHERE ?",
//     [
//         {
//             stock_quantity: res[0].stock_quantity - answers.howMany
//         },
//         {
//             id: res[0].id
//         }
//     ],
//     function(error) {
//         if (error) throw err;
//         console.log("Purchased " + answers.howMany + "of " + res[0].product_name + "successfully!");
//     }
//     )
//     .then(function(answers){
        
//     });
    
// }



// // connection.query("SELECT * FROM products WHERE id = ?", [answers.wannaBuy], function(err, res) {
// //     for (var i = 0; i < res.length; i++) {
// //       console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
// //     }
// //   });

/*******************************************

var userId = 1;
var columns = ['username', 'email'];
var query = connection.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userId], function (error, results, fields) {
  if (error) throw error;
  // ...
});
 
console.log(query.sql); // SELECT `username`, `email` FROM `users` WHERE id = 1

*********************************************/