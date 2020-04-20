import * as http from "http";
import * as https from "https";

import { Log, LogLevelEnum, Core } from "@webfaas/webfaas-core";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "./EndPointHTTPConfig";
import { LogCodeEnum } from "@webfaas/webfaas-core/lib/Log/ILog";
import { SendMessageRest } from "./rest/SendMessageRest";

export class EndPointHTTP {
    private core: Core;
    private config: EndPointHTTPConfig;
    private log: Log;
    private server: http.Server | null = null;
    private sendMessageRest: SendMessageRest;
    
    constructor(core: Core, config: EndPointHTTPConfig){
        this.core = core;
        this.config = config;
        this.log = core.getLog();

        this.onProcessHTTP = this.onProcessHTTP.bind(this);

        this.sendMessageRest = new SendMessageRest(this);
    }

    buildHeaders(contentType?: string): http.OutgoingHttpHeaders{
        var headers: http.OutgoingHttpHeaders = {};

        headers["server"] = "webfaas";
        headers["content-type"] = contentType || "text/plain";

        return headers;
    }

    getConfig(): EndPointHTTPConfig{
        return this.config;
    }

    getLog(): Log{
        return this.log;
    }

    getCore(): Core{
        return this.core;
    }

    writeEnd(response: http.ServerResponse, statusCode: number, headers: http.OutgoingHttpHeaders, chunk: any): void{
        response.writeHead(statusCode, headers);
        response.write(chunk);
        response.end();
    }
    
    onProcessHTTP(request: http.IncomingMessage, response: http.ServerResponse): void{
        let bodyList: Array<any> = [];
        try {
            request.on("data", function(chunk) {
                bodyList.push(chunk);
            }).on("end", () => {
                try {
                    let body: Buffer = Buffer.concat(bodyList);
                    this.sendMessageRest.processRequest(request, response, body);
                }
                catch (errTry) {
                    this.writeEnd(response, 500, this.buildHeaders(), "Internal Server Error");
                }
            });
        }
        catch (errTry) {
            this.log.writeError("onProcessHTTP", errTry, undefined, __filename);
            this.writeEnd(response, 500, this.buildHeaders(), "Internal Server Error");
        }
    }

    start(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                if (this.config.type === EndPointHTTPConfigTypeEnum.HTTPS){
                    if (this.config.httpConfig){
                        this.server = https.createServer(this.config.httpConfig, this.onProcessHTTP);
                    }
                    else{
                        this.server = https.createServer(this.onProcessHTTP);
                    }
                }
                else{
                    if (this.config.httpConfig){
                        this.server = http.createServer(this.config.httpConfig, this.onProcessHTTP);
                    }
                    else{
                        this.server = http.createServer(this.onProcessHTTP);
                    }
                }
        
                let opt = {port:this.config.port, hostname: this.config.hostname};
                this.server.listen(opt, () => {
                    this.log.write(LogLevelEnum.INFO, "start", LogCodeEnum.PROCESS, "Server started", opt, __filename);
                    resolve();
                })                
            }
            catch (errTry) {
                this.log.writeError("start", errTry, undefined, __filename);
                reject(errTry);
            }
        })
    }

    stop(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.server){
                this.server.close(()=>{
                    this.log.write(LogLevelEnum.INFO, "stop", LogCodeEnum.PROCESS, "Server stoped", undefined, __filename);
                    this.server = null;
                    resolve();
                });
            }
            else{
                resolve();
            }
        })
    }
}