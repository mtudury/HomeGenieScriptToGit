#!/bin/bash

source latest_version.sh
docker run --user $(id -u):$(id -g) --rm -v ${pwd}/data/:/hstg/ext/ --name=hstg hstg:${hstgversion}
