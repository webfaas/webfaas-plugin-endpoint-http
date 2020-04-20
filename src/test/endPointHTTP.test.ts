import * as chai from "chai";

import { Log, LogLevelEnum, Core } from "@webfaas/webfaas-core";

import { EndPointHTTP } from "../lib/EndPointHTTP";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";

const log = new Log();
log.changeCurrentLevel(LogLevelEnum.OFF);
const core = new Core(undefined, log);

describe("EndPointHTTP", () => {
    it("getCore", function(){
        const config = new EndPointHTTPConfig();
        const endPointHTTP = new EndPointHTTP(core, config);
        chai.expect(typeof(endPointHTTP.getCore())).to.eq("object");
    })

    it("getLog", function(){
        const config = new EndPointHTTPConfig();
        const endPointHTTP = new EndPointHTTP(core, config);
        chai.expect(typeof(endPointHTTP.getLog())).to.eq("object");
    })

    it("getConfig", function(){
        const config = new EndPointHTTPConfig();
        const endPointHTTP = new EndPointHTTP(core, config);
        chai.expect(endPointHTTP.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
        chai.expect(endPointHTTP.getConfig().port).to.eq(8080);
        chai.expect(endPointHTTP.getConfig().hostname).to.eq(undefined);
    })

    it("buildHeaders - default", function(){
        const config = new EndPointHTTPConfig();
        const endPointHTTP = new EndPointHTTP(core, config);
        const headers = endPointHTTP.buildHeaders();
        chai.expect(headers["server"]).to.eq("webfaas");
        chai.expect(headers["content-type"]).to.eq("text/plain");
    })

    it("buildHeaders", function(){
        const config = new EndPointHTTPConfig();
        const endPointHTTP = new EndPointHTTP(core, config);
        const headers = endPointHTTP.buildHeaders("content1");
        chai.expect(headers["server"]).to.eq("webfaas");
        chai.expect(headers["content-type"]).to.eq("content1");
    })

    it("simulate error - onProcessHTTP", function(){
        const config = new EndPointHTTPConfig();
        const endPointHTTP = new EndPointHTTP(core, config);
        const headers = endPointHTTP.buildHeaders("content1");

        try {
            endPointHTTP.onProcessHTTP({} as any, {} as any);
            throw new Error("Sucess");
        }
        catch (errTry) {
            chai.expect(errTry.message).to.include("function");
        }
    })
})