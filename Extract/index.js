
var request = require('request');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var config = require('./config.json');

var git = require('simple-git')(config.dest_path);


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
    if (!config.extract)
        return programs;

    if ((!config.extract.groups)&&(!config.extract.programs))
        return programs;

    if ((config.extract.groups)&&(config.extract.groups.length==0)&&(config.extract.programs)&&(config.extract.programs.length==0))
        return programs;

    let dest = [];

    programs.forEach(function (prg) { 
        if ((config.extract.groups)&&(config.extract.groups.includes(prg.Group)))
            dest.push(prg);
        else if ((config.extract.programs)&&(config.extract.programs.includes(prg.Name)))
            dest.push(prg);
    })

    return dest;
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
    fs.writeFileSync(path.join(programpath,"scriptcondition_" + sanitize(program.Name) + extension), unescape(program.ScriptCondition));
    fs.writeFileSync(path.join(programpath,"raw_" + sanitize(program.Name) + ".json"), JSON.stringify(program));

    console.log('Extracted ' + program.Group + ' - ' + program.Name);
}


loadProgramsFromHomegenie().then(function (body) { 
    filterPrograms(JSON.parse(body)).forEach(function(prg) { writeProgramToDisk(prg)});
    if (config.git.use_git) {
        git.status(function(err, status) {
            if (err)
                console.log(err);
            else if ((status.not_added.length > 0)||(status.created.length > 0)||(status.deleted.length > 0)||(status.modified.length > 0)||(status.renamed.length > 0)) {
                git.add('.', function (err) {
                    if (err)
                        console.log(err);
                    else {
                        var message = 'HomeGenieScriptToGit autocommit '+ new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                        git.commit(message, null, null, function (err, summary) {
                            if (err)
                                console.log(err);
                            else {
                                console.log('git commit ok.')
                                if (config.git.push) {
                                    git.push(function (err) {
                                        if (err)
                                            console.log(err);
                                        else
                                            console.log('git push done.');
                                    })
                                }
                            }
                        })
                    }

                })
            } else console.log('No changes detected');
        });
    }
 });
