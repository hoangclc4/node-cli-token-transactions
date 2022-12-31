Portfolio Command-Line Application
===========================

A simple command-line application built with Node.js and the [meow](https://www.npmjs.com/package/meow) package, with build for answer the question:

- Let assume you are a crypto investor. You have made transactions over a period of time which is logged in a [CSV file](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip). Write a command line program that does the following

  - Given no parameters, return the latest portfolio value per token in USD
  - Given a token, return the latest portfolio value for that token in USD
  - Given a date, return the portfolio value per token in USD on that date
  - Given a date and a token, return the portfolio value of that token in USD on that date



Installation
------------
First, download the transaction.csv file from [here](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip) and unzip it to the project folder.

To install the application, run the following command:


`npm install`

Usage
-----

To use the application, run the following command:

`./index.js [options] <arguments>`
```shell
### Options

*   -c, --clear     Clear the console
*   --noClear       Don't clear the console
*   -h, --help      Show help
*   -v, --version   Show version number
*   -c, --commands  Base on several type of string input, the CLI will run different command:
     1: Get lastest portfolio value for each token in the dataset                  
     2: Get lastest portfolio value for token "token" in the dataset               
     3: Get portfolio value per token in USD on date "date"                        
     4: Get portfolio value for token "token in USD on date "date" 
*   -t, --token     Token name, eg: BTC
*   -d, --date      Date, eg: 2018-01-01


### Examples
## show help
*   $ ./index.js help  
## show version
*   $ ./index.js --version
## run command
*   $ ./index.js -c 1
*   $ ./index.js -c 2 -t BTC
*   $ ./index.js -c 3 -d 2018-01-01
*   $ ./index.js -c 4 -t BTC -d 2018-01-01
```

This is sample output of the application:

`✔ Getting completed! Portfolio value for token "BTC" in USD on date "2019-9-12" is 
🚀 
At 2019-9-12: token "BTC" with portfolioValue is 100.0 USD`


`✔ Getting completed! Portfolio value for token "ETH" in USD on date "2019-9-12" is:  
🚀
At 2019-9-12: token "ETH" with portfolioValue is 198.54140184999997 USD`

What is in the project, and how it works?
------------
The project is built with Node.js and the [meow](https://www.npmjs.com/package/meow) package. The project is structured as follows: 
...

License
-------

This project is licensed under the MIT License.

