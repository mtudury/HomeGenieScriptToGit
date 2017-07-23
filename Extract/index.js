
var request = require('request');
var config = require('./config.json');


function LoadProgramsFromHomegenie(callback) {
    return new Promise(function (resolve, reject) {
        request({
                url:  config.homegenie.url + '/api/HomeAutomation.HomeGenie/Automation/Programs.List/',
                timeout: 60000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
            },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered 
                    reject(error);
                } else {
                    console.log('--- headers:');
                    console.log(response.headers); // response headers 
                    console.log('--- body:');
                    console.log(body);             // content of package 
                    resolve(body);
                }
            }
        );
    });
}

function FilterPrograms(programs) {



    
}

function WriteProgramToDisk(program) {

}


LoadProgramsFromHomegenie().then(function (body) { FilterPrograms(JSON.parse(body)).each(function(prg) { WriteProgramToDisk(prg)}); });
