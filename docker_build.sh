#!/bin/bash

if [[ "${hstgversion}" == "" ]]; then
	echo "execute before : source latest_version.sh"
	exit 1
fi


docker build -t hstg:${hstgversion} . -f Docker/Dockerfile
