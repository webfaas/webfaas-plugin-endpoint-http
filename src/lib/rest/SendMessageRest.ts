import * as http from "http";
import * as url from "url";

import { Log, Core, MessageUtil } from "@webfaas/webfaas-core";
import { IMessage } from "@webfaas/webfaas-core/lib/MessageManager/IMessage";
import { EndPointHTTP } from "../EndPointHTTP";
import { IMessageError } from "@webfaas/webfaas-core/lib/Util/MessageUtil";

const uuid_v1 = require("uuid/v1");

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
                let msgError: IMessageError = MessageUtil.convertCodeErrorToHttp(errSend)
                this.endPointHTTP.writeEnd(response, msgError.code, this.endPointHTTP.buildHeaders(), msgError.message); //msgError.detail
            });
        }
        else{
            this.endPointHTTP.writeEnd(response, 400, this.endPointHTTP.buildHeaders(), "Module name and version required");
        }
    }
}