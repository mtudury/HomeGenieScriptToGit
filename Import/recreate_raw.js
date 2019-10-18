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

    fs.writeFileSync(filename_raw, JSON.stringify(content,null,4));
}














let args = process.argv.slice(2);

if (args.length > 0) {
    console.log("todo one file");

} else {
    migrate_raw('../data/test.json', "../data/test.cs", "../data/raw_test.json");
}
