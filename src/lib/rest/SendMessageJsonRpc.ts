import * as http from "http";

import { Log, Core, MessageUtil, WebFaasError } from "@webfaas/webfaas-core";
import { IMessage } from "@webfaas/webfaas-core/lib/MessageManager/IMessage";
import { EndPointHTTP } from "../EndPointHTTP";
import { IJsonRpcRequest, JsonRpcErrorTypeEnum } from "@webfaas/webfaas-core/lib/Util/MessageUtil";

const uuid_v1 = require("uuid/v1");

export class SendMessageJsonRpc {
    private endPointHTTP: EndPointHTTP;
    private log: Log;
    private core: Core;
    
    constructor(endPointHTTP: EndPointHTTP){
        this.endPointHTTP = endPointHTTP;
        this.core = endPointHTTP.getCore();
        this.log = endPointHTTP.getLog();
    }

    processRequest(request: http.IncomingMessage, response: http.ServerResponse, body: Buffer): void{
        let payloadRequest: IJsonRpcRequest;
        let msg: IMessage | null;

        try {
            payloadRequest = MessageUtil.parseJsonRpcRequest(body);
        }
        catch (errTryParse) {
            let responseJson = MessageUtil.parseJsonRpcResponseError(MessageUtil.convertErrorToCodeJsonRpc(errTryParse), errTryParse);
            this.endPointHTTP.writeEnd(response, 200, this.endPointHTTP.buildHeaders(), JSON.stringify(responseJson));
            this.log.writeError("processRequest", errTryParse, undefined, __filename);
            return;
        }

        msg = MessageUtil.parseMessageByPayloadJsonRpc(payloadRequest, "", request.method, request.headers);
        
        if (msg){
            let requestID: string | number = payloadRequest.id || MessageUtil.parseString(request.headers["X-Request-ID"]) || uuid_v1();
            msg.header.messageID = requestID.toString();
            
            this.core.sendMessage(msg).then((msgResponse) => {
                let responseJsonRpc: any;
                let statusCode: number = 200;
                let headers = this.endPointHTTP.buildHeaders("application/json-rpc");

                if (msgResponse){
                    responseJsonRpc = MessageUtil.parseJsonRpcResponseSuccess(msgResponse.payload, requestID);
                }
                else{
                    responseJsonRpc = MessageUtil.parseJsonRpcResponseSuccess(null, requestID);
                }
                this.endPointHTTP.writeEnd(response, statusCode, headers, JSON.stringify(responseJsonRpc));
            }).catch((errSend)=>{
                let responseJson = MessageUtil.parseJsonRpcResponseError(MessageUtil.convertErrorToCodeJsonRpc(errSend), errSend);
                this.endPointHTTP.writeEnd(response, 200, this.endPointHTTP.buildHeaders(), JSON.stringify(responseJson));
                this.log.writeError("processRequest", errSend, undefined, __filename);
            });
        }
        else{
            let responseJson = MessageUtil.parseJsonRpcResponseError(JsonRpcErrorTypeEnum.INVALID_REQUEST, new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.PAYLOAD_INVALID, "empty payload"));
            this.endPointHTTP.writeEnd(response, 200, this.endPointHTTP.buildHeaders(), JSON.stringify(responseJson));
            this.log.writeError("processRequest", new Error("payload required"), undefined, __filename);
        }
    }
}