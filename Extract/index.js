
const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');

const git = require('simple-git')(config.dest_path);

let PromisePool = require('es6-promise-pool')

function loadProgramsFromHomegenie() {
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
                    resolve(body);
                }
            }
        );
    });
}

function loadWidgetsFromHomegenie() {
    return new Promise(function (resolve, reject) {
        request({
                url:  config.homegenie.url + '/api/HomeAutomation.HomeGenie/Config/Widgets.List/',
                timeout: 60000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
            },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered 
                    reject(error);
                } else {
                    resolve(body);
                }
            }
        );
    });
}

function loadWidgetContentFromHomegenie(widget_path) {
    return new Promise(function (resolve, reject) {
        request({
                url:  config.homegenie.url + '/hg/html/pages/control/widgets/' + widget_path,
                timeout: 60000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
            },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered 
                    reject(error);
                } else {
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
    });

    return dest;
}

function filterWidgets(widgets) {

    let dest = [];

    widgets.forEach(function (widget) { 
        if (!widget.startsWith("homegenie/"))
            dest.push(widget);
    });

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


    let programpath = path.join( config.dest_path, "programs", sanitize(program.Group), sanitize(program.Name));

    mkdirp.sync(programpath);

    fs.writeFileSync(path.join(programpath,"raw_" + san_program_name + ".json"), JSON.stringify(program));

    delete program.TriggerTime;
    delete program.ActivationTime;

    let san_program_name = sanitize(program.Name);
    let source = program.ScriptSource;
    let condition = program.ScriptCondition;

    delete program.ScriptSource;
    delete program.ScriptCondition;
    delete program.ScriptSetup;

    if (source)
	fs.writeFileSync(path.join(programpath,"scriptsource_" + san_program_name + extension), unescape(source));
    if (condition)
        fs.writeFileSync(path.join(programpath,"scriptcondition_" + san_program_name + extension), unescape(condition));
    fs.writeFileSync(path.join(programpath,"metadata_" + san_program_name + ".json"), JSON.stringify(program, null, 4));

    console.log('Extracted ' + program.Group + ' - ' + program.Name);
}

function writeWidgetsToDisk(widget_path, content) {
    let widgetpath = path.join( config.dest_path, "widgets", widget_path);

    mkdirp.sync(path.dirname(widgetpath));

    fs.writeFileSync(widgetpath, content);

    console.log('Extracted ' + widget_path);
}

console.log('-- Programs --');
loadProgramsFromHomegenie().then(function (body) { 
    filterPrograms(JSON.parse(body)).forEach(function(prg) { writeProgramToDisk(prg); });

    console.log('-- Widgets --');
    loadWidgetsFromHomegenie().then(function (body) { 
        let widgets = filterWidgets(JSON.parse(body));
        const generatePromises = function * () {
            for (let count = 0; count < widgets.length; count++) {
                let widget = widgets[count];
                yield loadWidgetContentFromHomegenie(widget + ".html").then(function (content) {
                    writeWidgetsToDisk(widget + ".html", content);
                });
                yield loadWidgetContentFromHomegenie(widget + ".js").then(function (content) {
                    writeWidgetsToDisk(widget + ".js", content);
                });
            }
        };
        let pool = new PromisePool(generatePromises, 2);

        pool.start().then(function() {
            if (config.git.use_git) {
                console.log('-- GIT --');
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
    });
});
