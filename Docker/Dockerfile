FROM node:10-jessie

COPY Extract/ /hstg/
COPY Docker/startup.sh /hstg/

WORKDIR /hstg/

RUN ln -s /hstg/ext/config.json /hstg/config.json
RUN npm install

VOLUME /hstg/ext

CMD [ "bash", "startup.sh" ]
