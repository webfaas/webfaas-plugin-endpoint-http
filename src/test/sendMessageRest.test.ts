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

    it("extractModuleInfoFromContext - module1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("module1");
        chai.expect(info).to.null;
    })

    //
    //WHITOUT SCOPE
    //
    it("extractModuleInfoFromContext - module1/version1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("module1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("");
        chai.expect(info?.path).to.eq("");
    })

    it("extractModuleInfoFromContext - /module1/version1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("/module1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("");
        chai.expect(info?.path).to.eq("");
    })

    it("extractModuleInfoFromContext - module1:method1/version1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("module1:method1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("");
    })

    it("extractModuleInfoFromContext - module1:method1/version1/path1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("module1:method1/version1/path1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1");
    })

    it("extractModuleInfoFromContext - module1:method1/version1/path1/subpath2", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("module1:method1/version1/path1/subpath2");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1/subpath2");
    })

    //
    //WITH SCOPE
    //
    it("extractModuleInfoFromContext - @scope1/module1/version1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("@scope1/module1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("");
        chai.expect(info?.path).to.eq("");
    })
    
    it("extractModuleInfoFromContext - @scope1/module1:method1/version1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("@scope1/module1:method1/version1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("");
    })

    it("extractModuleInfoFromContext - @scope1/module1:method1/version1/path1", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("@scope1/module1:method1/version1/path1");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1");
    })

    it("extractModuleInfoFromContext - @scope1/module1:method1/version1/path1/subpath2", function(){
        let info = sendMessageRest.extractModuleInfoFromContext("@scope1/module1:method1/version1/path1/subpath2");
        chai.expect(info).to.not.null;
        chai.expect(info?.name).to.eq("@scope1/module1");
        chai.expect(info?.version).to.eq("version1");
        chai.expect(info?.method).to.eq("method1");
        chai.expect(info?.path).to.eq("/path1/subpath2");
    })
})