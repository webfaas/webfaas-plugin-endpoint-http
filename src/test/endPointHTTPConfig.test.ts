import * as chai from "chai";

import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";

describe("EndPointHTTP - Config", () => {
    it("config - default", function(){
        var config_1 = new EndPointHTTPConfig();
        
        chai.expect(config_1.port).to.eq(8080);
        chai.expect(config_1.hostname).to.eq(undefined);
        chai.expect(config_1.type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
        chai.expect(config_1.httpConfig?.rejectUnauthorized).to.eq(undefined);
    })

    it("config - should return properties", function(){
        var config_1 = new EndPointHTTPConfig(9090, "localhost1", EndPointHTTPConfigTypeEnum.HTTP, {rejectUnauthorized: true});
        
        chai.expect(config_1.port).to.eq(9090);
        chai.expect(config_1.hostname).to.eq("localhost1");
        chai.expect(config_1.type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
        chai.expect(config_1.httpConfig?.rejectUnauthorized).to.eq(true);
    })
})