import * as http from "http";
import * as url from "url";

import { Log, Core, MessageUtil, WebFaasError, IMessage } from "@webfaas/webfaas-core";
import { EndPointHTTP } from "../EndPointHTTP";

import { v1 as uuid_v1 } from "uuid";

export class SendMessageRest {
    private endPointHTTP: EndPointHTTP;
    private log: Log;
    private core: Core;
    
    constructor(endPointHTTP: EndPointHTTP){
        this.endPointHTTP = endPointHTTP;
        this.core = endPointHTTP.getCore();
        this.log = endPointHTTP.getLog();
    }

    processRequest(request: http.IncomingMessage, response: http.ServerResponse, body: Buffer): void{
        let requestContentType = request.headers["content-type"] || "";
        let payload: any;
        let msg: IMessage | null;

        if (body.length){
            if (requestContentType === "application/json"){
                try {
                    payload = JSON.parse(body.toString());
                }
                catch (errTryParse) {
                    this.log.writeError("processRequest", errTryParse, undefined, __filename);
                    this.endPointHTTP.writeEnd(response, 400, this.endPointHTTP.buildHeaders(), "Parse error");
                    return;
                }
            }
            else{
                payload = body;
            }
        }
        else{
            payload = null;
        }

        let urlString: string = decodeURI(request.url || "");
        let route = this.endPointHTTP.getConfig().route[urlString];
        if (route){
            urlString = route;
        }
        let urlObj = url.parse(urlString, true);
        
        msg = MessageUtil.parseMessageByUrlPath(urlObj.pathname || "", "", payload, request.method, request.headers);
        
        if (msg){
            msg.header.messageID = msg.header.messageID || MessageUtil.parseString(request.headers["X-Request-ID"]) || uuid_v1();
            
            this.core.sendMessage(msg).then((msgResponse) => {
                let chunk: any;
                let statusCode: number = 200;
                let headers = this.endPointHTTP.buildHeaders("application/json");
                if (msgResponse){
                    if (msgResponse.header && msgResponse.header.http){
                        if (msgResponse.header.http.statusCode){
                            statusCode = msgResponse.header.http.statusCode;
                        }
                        if (msgResponse.header.http.headers){
                            headers = msgResponse.header.http.headers;
                        }
                        if (msgResponse.header.http.contentType){
                            headers["content-type"] = msgResponse.header.http.contentType;
                        }
                    }
                    
                    if (msgResponse.payload === undefined || msgResponse.payload === null){
                        chunk = undefined;
                        statusCode = 204; //No Content
                    }
                    else{
                        chunk = msgResponse.payload;
                        if (headers["content-type"] === "application/json" && !Buffer.isBuffer(chunk)){
                            chunk = JSON.stringify(chunk);
                        }
                    }
                }
                else{
                    chunk = undefined;
                    statusCode = 204; //No Content
                }
                this.endPointHTTP.writeEnd(response, statusCode, headers, chunk);
            }).catch((errSend)=>{
                this.endPointHTTP.writeEnd(response, MessageUtil.convertErrorToCodeHttp(errSend), this.endPointHTTP.buildHeaders("application/json"), JSON.stringify(errSend));
            });
        }
        else{
            let errValidate = new WebFaasError.ValidateError("0", "", "Module name and version required");
            this.endPointHTTP.writeEnd(response, MessageUtil.convertErrorToCodeHttp(errValidate), this.endPointHTTP.buildHeaders("application/json"), JSON.stringify(errValidate));
        }
    }
}