
var request = require('request');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var config = require('./config.json');


function loadProgramsFromHomegenie(callback) {
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
                    /*
                    console.log('--- headers:');
                    console.log(response.headers); // response headers 
                    console.log('--- body:');
                    console.log(body);             // content of package 
                    */
                    resolve(body);
                }
            }
        );
    });
}

function filterPrograms(programs) {



    return programs;
}

function sanitize(pathpart) {
    if (!pathpart)
        return "no_name";
    return pathpart.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function unescape(scriptsource) {
    return scriptsource.replace(/\\n/g, '\n');
}

function writeProgramToDisk(program) {
    let extension = ".txt";
    if (program.Type == "CSharp") {
        extension = ".cs";
    }


    let programpath = path.join( config.dest_path, sanitize(program.Group), sanitize(program.Name));

    mkdirp.sync(programpath);

    fs.writeFileSync(path.join(programpath,"scriptsource_" + sanitize(program.Name) + extension), unescape(program.ScriptSource));
}


loadProgramsFromHomegenie().then(function (body) { filterPrograms(JSON.parse(body)).forEach(function(prg) { writeProgramToDisk(prg)}); });
