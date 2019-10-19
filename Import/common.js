
const path = require('path');
const fs = require('fs');
const config = require('./config.json');
const request = require('request');

exports.process_all_folders_programs = async function process_all_folders_programs(action) {
    let programsfolder = fs.readdirSync(path.join(config.dest_path, "programs"));
    for (const group of programsfolder) {
        let groupcontent = fs.readdirSync(path.join(config.dest_path, "programs", group));
        for (const program of groupcontent) {
            let pathprogram = path.join(config.dest_path, "programs", group, program);

            await action(pathprogram, program);
        }
    }
};


exports.loadProgramsGroups = function () {
    return new Promise(function (resolve, reject) {
        request({
                url:  config.homegenie.url + '/api/HomeAutomation.HomeGenie/Config/Groups.List/Automation/',
                timeout: 60000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
            },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered 
                    reject(error);
                } else {
                    resolve(JSON.parse(body));
                }
            }
        );
    });
}

exports.createProgramsGroup = function (groupname) {
    return new Promise(function (resolve, reject) {
        request({
                method: 'POST',
                body: groupname,
                url:  config.homegenie.url + '/api/HomeAutomation.HomeGenie/Config/Groups.Add/Automation/',
                timeout: 60000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
            },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered 
                    reject(error);
                } else {
                    resolve(body);
                    console.log(groupname + " created");
                    console.log("Response : " + body);
                    console.log("HTTP StatusCode : " + response.statusCode);
                }
            }
        );
    });
}