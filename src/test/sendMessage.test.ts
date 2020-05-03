import * as chai from "chai";

import { Log, LogLevelEnum, Core, WebFaasError } from "@webfaas/webfaas-core";

import { EndPointHTTP } from "../lib/EndPointHTTP";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";
import { SendMessageRest } from "../lib/rest/SendMessageRest";

const config = new EndPointHTTPConfig();

describe("SendMessageRest", () => {
    it("sendMessage - response - null", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve(null);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(204);
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
    })

    it("sendMessage - response - payload - null", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: null} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(204);
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
    })

    it("sendMessage - response - payload - undefined", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: undefined} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(204);
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
    })

    it("sendMessage - response - payload - invalid", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: undefined} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(400);
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{"content-type": "application/json"}} as any, {} as any, Buffer.from("----"));
    })

    it("sendMessage - response - header - http", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{}}} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(200);
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
    })

    it("sendMessage - response - header - http - statusCode", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{statusCode:202}}} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode){;
            chai.expect(statusCode).to.eq(202);
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
    })

    it("sendMessage - response - header - http - contentType - type1", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{contentType:"type1"}}} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode, headers){;
            chai.expect(headers["content-type"]).to.eq("type1");
            console.log("*****statusCode", statusCode);
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from("AAA"));
    })

    it("sendMessage - response - header - http - headers", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({header:{http:{headers:{"x-header":"type1"}}}} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode, headers){;
            chai.expect(headers["x-header"]).to.eq("type1");
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
    })

    it("sendMessage - response - header - payload buffer + http", async function(){
        const core = new Core();
        const endPointHTTP = new EndPointHTTP(core, config);
        const sendMessageRest = new SendMessageRest(endPointHTTP);
        
        core.sendMessage = function(){
            return new Promise((resolve, reject)=>{
                resolve({payload: Buffer.from("AA"), header:{http:{contentType:"application/json"}}} as any);
            });
        }
        endPointHTTP.writeEnd = function(response, statusCode, headers, chunk){;
            chai.expect(headers["content-type"]).to.eq("application/json");
            chai.expect(chunk.toString()).to.eq("AA");
        }
        sendMessageRest.processRequest({url: "/@registry1/math:sum/1", headers:{}} as any, {} as any, Buffer.from(""));
    })

    it("sendMessage - url empty", async function(){
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