import * as chai from "chai";

import { Log, LogLevelEnum, Core, WebFaasError } from "@webfaas/webfaas-core";

import { EndPointHTTP } from "../lib/EndPointHTTP";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";
import { SendMessageRest } from "../lib/rest/SendMessageRest";

const config = new EndPointHTTPConfig();

describe("SendMessageRest - ERROR", () => {
    it("ClientHttpError", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.ClientHttpError(new Error("client"), "/"));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(502);
        }
    })

    it("CompileError", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.CompileError(new Error("client")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(501);
        }
    })

    it("NotFoundError", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.NotFoundError(WebFaasError.NotFoundErrorTypeEnum.DEPENDENCY, "name1"));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(404);
        }
    })

    it("SecurityError - FORBIDDEN", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.FORBIDDEN, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(403);
        }
    })

    it("SecurityError - INVALIDCREDENTIALS", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.INVALIDCREDENTIALS, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(401);
        }
    })

    it("SecurityError - MISSINGCREDENTIALS", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.MISSINGCREDENTIALS, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(401);
        }
    })

    it("SecurityError - PAYLOADINVALID", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.PAYLOADINVALID, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(400);
        }
    })

    it("SecurityError - PAYLOADLARGE", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.PAYLOADLARGE, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(413);
        }
    })

    it("SecurityError - THROTTLED", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.THROTTLED, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(429);
        }
    })

    it("SecurityError - UNCLASSIFIED", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(WebFaasError.SecurityErrorTypeEnum.UNCLASSIFIED, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(400);
        }
    })

    it("SecurityError - NOT MAPPED", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new WebFaasError.SecurityError(-100 as any, new Error("error1")));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(400);
        }
    })

    it("Error - NOT MAPPED", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                reject(new Error("error1"));
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(500);
        }
    })

    it("sendMessage - response - null", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve(null);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(204);
        }
    })

    it("sendMessage - response - payload - null", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: null} as any);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(204);
        }
    })

    it("sendMessage - response - payload - undefined", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: undefined} as any);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(204);
        }
    })

    it("sendMessage - response - header - http", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{}}} as any);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(200);
        }
    })

    it("sendMessage - response - header - http - statusCode", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{statusCode:202}}} as any);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(202);
        }
    })

    it("sendMessage - response - header - http - contentType - type1", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{contentType:"type1"}}} as any);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode, headers){;
            chai.expect(headers["content-type"]).to.eq("type1");
        }
    })

    it("sendMessage - response - header - http - headers", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{headers:{"x-header":"type1"}}}} as any);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode, headers){;
            chai.expect(headers["x-header"]).to.eq("type1");
        }
    })

    it("sendMessage - response - header - payload buffer + http", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: Buffer.from("AA"), header:{http:{contentType:"application/json"}}} as any);
            });
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
        endPointHTTP.writeEnd = function(response, statusCode, headers, chunk){;
            chai.expect(headers["content-type"]).to.eq("application/json");
            chai.expect(chunk.toString()).to.eq("AA");
        }
    })

    it("sendMessage - url empty", function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: Buffer.from("AA"), header:{http:{contentType:"application/json"}}} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode, headers, chunk){;
            chai.expect(statusCode).to.eq(400);
        }
        sendMessageRest.processRequest({url: "", headers:{}} as any, {} as any, Buffer.from(""));
    })
})