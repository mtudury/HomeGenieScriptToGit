
const request = require('request');
const path = require('path');
const fs = require('fs');
const config = require('./config.json');


const common = require('./common');



async function importProgramRaw(content, name) {
    await new Promise((resolve, reject) => {
        request({
            method: "POST",
            url: config.homegenie.url + '/api/HomeAutomation.HomeGenie/Automation/Programs.Compile/',
            body: content,
            timeout: 60000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
        },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered 
                    reject(error);
                } else {
                    resolve(body);
                    console.log(name + " imported");
                    console.log("Response : " + body);
                    console.log("HTTP StatusCode : " + response.statusCode);
                }
            });
    });
}


async function importraw() {
    try {
        let groups = await common.loadProgramsGroups();

        await common.process_all_folders_programs(async function (pathprogram, programname) {
            const pathraw = path.join(pathprogram, "raw_" + programname + ".json");

            const content = fs.readFileSync(pathraw);
            const program = JSON.parse(content);

            let exist = false;
            for (const group of groups) {
                if (group.Name == program.Group) {
                    exist = true;
                }
            }

            if (!exist) {
                await common.createProgramsGroup(program.Group);

                groups = await common.loadProgramsGroups();
            }

            await importProgramRaw(content, programname);
        });
    } catch (e) {
        console.error(e);
    }
}



let args = process.argv.slice(2);

if (args.length > 0) {
    let pathtoprogramfile = args[0];
    importProgramRaw(pathtoprogramfile);

} else {
    importraw();
}