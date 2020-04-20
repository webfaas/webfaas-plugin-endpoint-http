import * as chai from "chai";

import { Log, LogLevelEnum, Core } from "@webfaas/webfaas-core";

import { EndPointHTTP } from "../lib/EndPointHTTP";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";
import { SendMessageRest } from "../lib/rest/SendMessageRest";

const core = new Core();
const config = new EndPointHTTPConfig();
const endPointHTTP = new EndPointHTTP(core, config);
const sendMessageRest = new SendMessageRest(endPointHTTP);

describe("SendMessageRest", () => {
    it("parseString", function(){
        chai.expect(sendMessageRest.parseString("1")).to.eq("1");
        chai.expect(sendMessageRest.parseString(null)).to.eq("");
    })

    it("parseModuleInfo - module1", function(){
        let info = sendMessageRest.parseModuleInfo("module1");
        chai.expect(info).to.null;
    })

    //
    //WHITOUT SCOPE
    //
    it("parseModuleInfo - module1/version1", function(){
        let info = sendMessageRest.parseModuleInfo("module1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("");
        chai.expect(info?.path).to.eq("");
    })

    it("parseModuleInfo - /module1/version1", function(){
        let info = sendMessageRest.parseModuleInfo("/module1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("");
        chai.expect(info?.path).to.eq("");
    })

    it("parseModuleInfo - module1:method1/version1", function(){
        let info = sendMessageRest.parseModuleInfo("module1:method1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("");
    })

    it("parseModuleInfo - module1:method1/version1/path1", function(){
        let info = sendMessageRest.parseModuleInfo("module1:method1/version1/path1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1");
    })

    it("parseModuleInfo - module1:method1/version1/path1/subpath2", function(){
        let info = sendMessageRest.parseModuleInfo("module1:method1/version1/path1/subpath2");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1/subpath2");
    })

    //
    //WITH SCOPE
    //
    it("parseModuleInfo - @scope1/module1/version1", function(){
        let info = sendMessageRest.parseModuleInfo("@scope1/module1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("");
        chai.expect(info?.path).to.eq("");
    })
    
    it("parseModuleInfo - @scope1/module1:method1/version1", function(){
        let info = sendMessageRest.parseModuleInfo("@scope1/module1:method1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("");
    })

    it("parseModuleInfo - @scope1/module1:method1/version1/path1", function(){
        let info = sendMessageRest.parseModuleInfo("@scope1/module1:method1/version1/path1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1");
    })

    it("parseModuleInfo - @scope1/module1:method1/version1/path1/subpath2", function(){
        let info = sendMessageRest.parseModuleInfo("@scope1/module1:method1/version1/path1/subpath2");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1/subpath2");
    })

    it("parseModuleInfo - empty", function(){
        let info = sendMessageRest.parseAuthorizationInfo("");
        chai.expect(info).to.null;
    })

    it("parseModuleInfo - Bearer", function(){
        let info = sendMessageRest.parseAuthorizationInfo("Bearer");
        chai.expect(info).to.null;
    })

    it("parseModuleInfo - Bearer AAA", function(){
        let info = sendMessageRest.parseAuthorizationInfo("Bearer AAA");
        chai.expect(info).to.not.null;
        chai.expect(info?.type).to.eq("bearer");
        chai.expect(info?.token).to.eq("AAA");
    })
})