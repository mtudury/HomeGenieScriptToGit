const path = require('path');
const fs = require('fs');
const config = require('./config.json');





function migrate_raw(filename_metadata, filename_source, filename_raw) {
    if (fs.existsSync(filename_raw)) {
        console.log(filename_raw + " allready exists ignoring");
        return;
    }
    if (!fs.existsSync(filename_metadata)) {
        console.log(filename_metadata + " does not exists ignoring");
        return;
    }
    if (!fs.existsSync(filename_source)) {
        console.log(filename_source + " does not exists ignoring");
        return;
    }
    let content = JSON.parse(fs.readFileSync(filename_metadata));
    content.ScriptSource = fs.readFileSync(filename_source).toString();

    console.log("creating "+filename_raw);
    fs.writeFileSync(filename_raw, JSON.stringify(content,null,4));
}


function process_all_folders() {
    let programsfolder = fs.readdirSync(path.join(config.src_path, "programs"));
    for (const group of programsfolder) {
        let groupcontent = fs.readdirSync(path.join(config.src_path, "programs", group));
        for (const program of groupcontent) {
            let pathprogram = path.join(config.src_path, "programs", group, program);

            let pathmetadata = path.join(pathprogram, "metadata_"+program+".json");
            let pathsource = path.join(pathprogram, "scriptsource_"+program+".cs");
            let pathraw = path.join(pathprogram, "raw_"+program+".json");
            migrate_raw(pathmetadata, pathsource, pathraw);
        }
    }
}



let args = process.argv.slice(2);

if (args.length > 0) {
    let metadata = args[0];
    let scriptsource = args[1];
    let rawoutput = args[2];
    migrate_raw(metadata, scriptsource, rawoutput);

} else {
    process_all_folders();
}
