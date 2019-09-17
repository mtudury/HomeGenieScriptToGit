#!/bin/bash

if [[ ! -f /hstg/ext/config.json ]]; then
    cp config.sample.json /hstg/ext/config.json
    mkdir /hstg/ext/git/
    cd /hstg/ext/git/
    git init .
    git config user.email "homegeniescripttogit@example.com"
    git config user.name "HomeGenie ScriptToGit"
    echo "!!! READ THIS !!!"
    echo "- data/config.json does not exist, It is now created copying sample, please update it"
    echo "- set your email adress in data/git/ : please run : cd data/git && git config user.email \"myemail@address.com\" && git config user.name \"Firstname LastName\""
    echo "then you can restart the container"
else
    node index.js
fi
