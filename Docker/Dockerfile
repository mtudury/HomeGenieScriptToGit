FROM node:10-jessie

COPY Extract/ /hstg/
COPY Import/ /hstgimport/
COPY Docker/startup.sh /hstg/

WORKDIR /hstg/

RUN ln -s /hstg/ext/config.json /hstg/config.json
RUN npm install

RUN ln -s /hstg/ext/config.json /hstgimport/config.json
RUN cd /hstgimport/ && npm install


VOLUME /hstg/ext

CMD [ "bash", "startup.sh" ]
