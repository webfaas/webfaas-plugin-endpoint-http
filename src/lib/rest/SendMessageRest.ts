import * as http from "http";
import * as url from "url";

import { Log, Core, WebFaasError } from "@webfaas/webfaas-core";
import { IMessage } from "@webfaas/webfaas-core/lib/MessageManager/IMessage";
import { IMessageHeaders } from "@webfaas/webfaas-core/lib/MessageManager/IMessageHeaders";
import { EndPointHTTP } from "../EndPointHTTP";
import { MessageManager } from "@webfaas/webfaas-core/lib/MessageManager/MessageManager";

const uuid_v1 = require("uuid/v1");

interface moduleInfo{
    name: string;
    method: string;
    version: string;
    path: string;
}

interface authorizationInfo{
    type: string;
    token: string;
}

//[@scope]/[modulename]/[version]
export class SendMessageRest {
    private endPointHTTP: EndPointHTTP;
    private log: Log;
    private core: Core;
    private messageManager: MessageManager;
    
    constructor(endPointHTTP: EndPointHTTP){
        this.endPointHTTP = endPointHTTP;
        this.core = endPointHTTP.getCore();
        this.messageManager = this.core.getMessageManager();
        this.log = endPointHTTP.getLog();
    }

    parseString(value: any): string{
        if (typeof(value) === "string"){
            return value;
        }
        else{
            return "";
        }
    }

    parseModuleInfo(context: string): moduleInfo | null{
        let result = {} as moduleInfo;
        let nameAndMethod: string;
        let version: string;
        let path: string = "";
        let lastIndexUsed = 0;

        if (context.substring(0,1) === "/"){
            context = context.substring(1);
        }
        const pathArray = context.split("/");
        if (pathArray.length === 1){
            return null;
        }

        else if (pathArray.length === 2){
            nameAndMethod = pathArray[0];
            version = pathArray[1];
            lastIndexUsed = 1;
        }
        else{
            if (pathArray[0].substring(0,1) === "@"){
                nameAndMethod = pathArray[0] + "/" + pathArray[1];
                version = pathArray[2];
                lastIndexUsed = 2;
            }
            else{
                nameAndMethod = pathArray[0];
                version = pathArray[1];
                lastIndexUsed = 1;
            }
        }

        for (let i = lastIndexUsed + 1; i < pathArray.length; i++){
            path += "/" + pathArray[i];
        }
        
        let nameAndMethodArray = nameAndMethod.split(":");
        if (nameAndMethodArray.length > 1){
            result.name = nameAndMethodArray[0];
            result.method = nameAndMethodArray[1];
        }
        else{
            result.name = nameAndMethodArray[0];
            result.method = "";
        }
        result.version = version;
        result.path = path;

        return result;
    }

    parseAuthorizationInfo(value: string): authorizationInfo | null{
        let result = {} as authorizationInfo;

        if (value){
            let authorizationArray = value.split(" ");
            if (authorizationArray.length === 2){
                result.type = authorizationArray[0].toLowerCase();
                result.token = authorizationArray[1];
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
        
        return result;
    }

    processRequest(request: http.IncomingMessage, response: http.ServerResponse, body: Buffer): void{
        let requestContentType = request.headers["content-type"] || "";
        let msg = {} as IMessage;
        let payload: any;

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
        let context = this.parseString(urlObj.pathname).substring(1);
        let moduleInfo: moduleInfo | null = this.parseModuleInfo(context);

        if (moduleInfo){
            msg.header = {} as IMessageHeaders;

            msg.header.name = moduleInfo.name;
            msg.header.method = moduleInfo.method;
            msg.header.version = this.messageManager.parseVersion(moduleInfo.version);
            msg.header.messageID = this.parseString(request.headers["X-Request-ID"]) || uuid_v1();
            msg.header.authorization = this.parseAuthorizationInfo(this.parseString(request.headers["Authorization"]));
            
            msg.header.http = {};
            msg.header.http.path = moduleInfo.path;
            msg.header.http.method = request.method;
            msg.header.http.headers = request.headers;

            msg.payload = payload;
            
            this.core.sendMessage(msg).then((msgResponse) => {
                let chunk: any;
                let statusCode: number = 200;
                let headers = this.endPointHTTP.buildHeaders("application/json");
                if (msgResponse){
                    if (msgResponse.header && msgResponse.header.http){
                        if (msgResponse.header.http.statusCode){
                            statusCode = msgResponse.header.http.statusCode;
                        }
                        if (msgResponse.header.http.contentType){
                            headers["content-type"] = msgResponse.header.http.contentType;
                        }
                        if (msgResponse.header.http.headers){
                            headers = msgResponse.header.http.headers;
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
                if (errSend instanceof WebFaasError.ClientHttpError){
                    let httpError: WebFaasError.ClientHttpError = errSend;
                    this.endPointHTTP.writeEnd(response, 502, this.endPointHTTP.buildHeaders(), `ClientHttpError. Code: ${httpError.code}`);
                }
                else if (errSend instanceof WebFaasError.CompileError){
                    let httpError: WebFaasError.CompileError = errSend;
                    this.endPointHTTP.writeEnd(response, 501, this.endPointHTTP.buildHeaders(), `CompileError. Code: ${httpError.code}`);
                }
                else if (errSend instanceof WebFaasError.NotFoundError){
                    let httpError: WebFaasError.NotFoundError = errSend;
                    this.endPointHTTP.writeEnd(response, 404, this.endPointHTTP.buildHeaders(), `${msg.header.name}.${httpError.artefactName} not found`);
                }
                else if (errSend instanceof WebFaasError.SecurityError){
                    let httpError: WebFaasError.SecurityError = errSend;
                    let statusCode: number = 400;
                    if (httpError.type === WebFaasError.SecurityErrorTypeEnum.MISSINGCREDENTIALS){
                        statusCode = 401;
                    }
                    else if (httpError.type === WebFaasError.SecurityErrorTypeEnum.FORBIDDEN){
                        statusCode = 403;
                    }
                    else if (httpError.type === WebFaasError.SecurityErrorTypeEnum.INVALIDCREDENTIALS){
                        statusCode = 401;
                    }
                    else if (httpError.type === WebFaasError.SecurityErrorTypeEnum.PAYLOADINVALID){
                        statusCode = 400;
                    }
                    else if (httpError.type === WebFaasError.SecurityErrorTypeEnum.PAYLOADLARGE){
                        statusCode = 413;
                    }
                    else if (httpError.type === WebFaasError.SecurityErrorTypeEnum.THROTTLED){
                        statusCode = 429;
                    }
                    else if (httpError.type === WebFaasError.SecurityErrorTypeEnum.UNCLASSIFIED){
                        statusCode = 400;
                    }
                    this.endPointHTTP.writeEnd(response, statusCode, this.endPointHTTP.buildHeaders(), `SecurityError. Type: ${httpError.type}; Code: ${httpError.code}; Message ${errSend.message}`);
                }
                else{
                    this.endPointHTTP.writeEnd(response, 500, this.endPointHTTP.buildHeaders(), "Internal Server Error");
                }
            });
        }
        else{
            this.endPointHTTP.writeEnd(response, 400, this.endPointHTTP.buildHeaders(), "Module name and version required");
        }
    }
}