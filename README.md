# Candle Stick Pattern Generator
This project provides an API which takes a csv file and and pattern type as input and yields a zip file containing:
* curated_data.csv: Contains csv data filtered from raw csv data for a given pattern type.
* curated_chart.html: Shows the candlestick chart for curated_data.csv.
* raw_data.csv: Its the input raw csv data provided as input.
* raw_chart.html: Shows the candlestick chart based on the raw_data.csv.

## Tech stack
* Development language: [Javascript][js]
* Development frameworks: [Nodejs][node], [Express][express]

## Prerequites
* Install node, npm
* Use [VSCode][vscode] as development IDE
* Install git

## Getting Started
* Clone the repo from [here](https://github.com/jyotiraj007/candlestick-pattern.git).
    ```
    git clone https://github.com/jyotiraj007/candlestick-pattern.git
    ```
    ```
    git checkout develop
    ```
* Launch [VSCode][vscode] and open the project folder.
* Run command to install project dependencies
    ```
    npm i
    ```
* Run command to start the server
    ```
    npm start 
    or 
    npm run start-watch
    ```
* Open swagger doc in the browser using following link
    ```
    http://localhost:3000/candlestick/docs/
    ```
* In swagger doc 
 - Click on post API to expand the doc for API.
 - Click on "Try it out" button.
 - In Request body section 
    - Click on "choose file" button to select the raw csv file.
    - Provide the value as "hammer" for the key "patternType".
 - Click on "Execute" button.
 - Goto "Server response" section under "Responses" section and a "Download file" link would be visible in 200 status code.
 - Click on "Download file" link to download a zip file which contains two folders
    - curated_chart
        - curated_chart.html: Shows the output candlesticj chart(hammer pattern).
        - curated_data.csv: Contains output csv data for hammer pattern.
    - raw_chart
        - raw_chart.html: Shows the raw candlestick chart(All the available patterns).
        - raw_data.csv: Contains raw csv data for all the patterns.

## In Progress
* Validation of input csv file






[node]: https://nodejs.org
[express]: http://expressjs.com/
[js]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[vscode]: https://code.visualstudio.com/
