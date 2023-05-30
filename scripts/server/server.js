// Copyright (C) Scott Henshaw
'use strict';

import Express from 'express'
import HTTP from 'http'

import FileSystem from 'fs-extra'
import Path from 'path'

const __dirname = Path.resolve();

const PORT = 4000;


class Server {

    constructor(api, port = PORT) {

        console.log("Creating server");

        this.api = Express();
        this.port = port;
        this.title = "Level Editor"

        this.api
            .use(Express.json())
            .use(Express.urlencoded({ extended: false }))
            .use('/', Express.static(`${Path.join(__dirname, '/')}`));

        this.api.get('/', (request, response) => {

            console.log('Request for static files');
            let file = `${Path.join(__dirname, '/')}index.html`;
            response.sendFile(file);
        });

        this.api.post('/api/save_level', (request, response) => {
            const data = JSON.stringify(request.body);

            FileSystem.writeFile(`${Path.join(__dirname, '/')}saved_level.json`, data, (err) => {
                if (err) {
                    console.error(err);
                    response.status(500).send('Error saving file');
                } else {
                    response.send('File saved');
                }
            });
        });

        // ...
        this.api.get("/api/load_level", async (request, response) => {
            try {
                const levelData = await this.loadLevelData();
                response.json({ success: true, data: levelData });
            } catch (error) {
                console.error(error);
                response.status(500).json({ success: false });
            }
        });



        this.api.post('/api/get_level_list/:id', (request, response) => {
            // handle post requests sent to this server for this edge
            let params = { ...request.query, ...request.params, ...request.body };
            let respData = {
                payload: [
                    {
                        name: "level_1",
                        filename: "level_1.json"
                    },
                ],
                error: 0
            };          


            let result = JSON.stringify(respData);
            response.send(result)
        })
    }

    async loadLevelData() {
        const levelFilePath = Path.join(__dirname, "level.json");
        const levelData = await FileSystem.readFile(levelFilePath, "utf-8");
        return JSON.parse(levelData);
    }

    run() {

        console.log("Server running");

        this.api.set('port', this.port);
        this.listener = HTTP.createServer(this.api);
        this.listener.listen(this.port);

        this.listener.on('listening', event => this.handleListenerListening(event));
    }

    handleListenerListening(event) {

        let address = this.listener.address();
        let bind = "";
        if (typeof address === `string`) {
            bind = `pipe ${address}`
        }
        else {
            bind = `port ${address.port}`
        }
        console.log(`Listening on ${bind}`)
    }
}

const server = new Server();
server.run();