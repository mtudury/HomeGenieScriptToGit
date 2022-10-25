#!/bin/bash

source latest_version.sh

[[ ! -d data ]] && mkdir data

docker run -it --user $(id -u):$(id -g) --rm -v ${PWD}/data/:/hstg/ext/ --name=hstg hstg:${hstgversion} bash
