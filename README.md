# HomeGenieScriptToGit
Automate script extraction from Homegenie, to be able to follow changes

Permit Import back to homegenie (restore older versions...)

## Requirements

- Node/npm  
- Git CLI  


## How to Install

Clone/Download this repository

go to the Extract folder  
run :
```bash
npm install  
```

copy config.sample.json to config.json  
modify config.json content to match your environment  

## How to run

configure config.json based on config.sample.json

```bash
cd Extract
node index.js
```
or using container : 

see start_latest.sh

## How to restore

copy config.json to Import folder

```bash
cd Import
node importraw.js
```

or using container :

see start_interactive.sh

then :

```bash
cd /hstgimport/
copy config.json
```
then 

```bash
node importraw.js
```

# docker usage

Save your Homegenie Scripts and widgets to Git :

Sample Usage :

Create a Cron : every days or hours ... depending on the frequency you want to save changes

start with :

create a data dir in current path, put your configuration : config.json file :

{
    "homegenie": { 
        "url": "http://url_of_homegenie/"
    },
    "extract": {
        "groups": ["VirtualModules","Services","Automation","Init"], 
        "programs": null
    },
    "dest_path": "/hstg/ext/git/",
    "git": {
        "use_git": true,
        "push": false
    }
}
then create a subfolder "git"  (./data/git)
go to the git folder and create a git repo :
```bash
git init .
git config user.email "the_email_you_want@to_use.lan"
git config user.name "Your Name"
```

then run with the command

docker run --user $(id -u):$(id -g) --rm -v ${PWD}/data/:/hstg/ext/ --name=hstg mtudury/hstg:0.4

