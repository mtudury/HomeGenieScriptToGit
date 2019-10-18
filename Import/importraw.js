
const request = require('request');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');







async function importProgramRaw(filename) {
    await new Promise((resolve, reject) => {
        request({
            method: "POST",
            url:  config.homegenie.url + '/api/HomeAutomation.HomeGenie/Automation/Programs.Compile/',
            body: fs.readFileSync(filename),
            timeout: 60000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
        },
        function (error, response, body) {
            if (error) {
                console.log('--- error:');
                console.log(error);            // error encountered 
                reject(error);
            } else {
                resolve(body);
                console.log(body);
                console.log(response.statusCode);
            }
        });
    });
}







let args = process.argv.slice(2);

if (args.length > 0) {
    console.log("todo one file");

} else {
    importProgramRaw('../data/raw_test.json');


}