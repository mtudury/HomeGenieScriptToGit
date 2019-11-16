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



