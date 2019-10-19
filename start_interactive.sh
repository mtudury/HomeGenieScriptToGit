#!/bin/bash

source latest_version.sh
docker run -it --user $(id -u):$(id -g) --rm -v ${PWD}/data/:/hstg/ext/ --name=hstg hstg:${hstgversion} bash
