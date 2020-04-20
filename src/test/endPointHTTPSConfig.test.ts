import * as chai from "chai";

import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";

describe("EndPointHTTPS - Config", () => {
    it("config - should return properties", function(){
        let opt = {
            ca: "ca1",
            cert: "cert1",
            pfx: "pfx1",
            passphrase: "passphrase1"
        }
        var config_1 = new EndPointHTTPConfig(9092, "localhost1", EndPointHTTPConfigTypeEnum.HTTPS, opt);
        
        chai.expect(config_1.port).to.eq(9092);
        chai.expect(config_1.hostname).to.eq("localhost1");
        chai.expect(config_1.type).to.eq(EndPointHTTPConfigTypeEnum.HTTPS);
        chai.expect(config_1.httpConfig?.ca).to.eq("ca1");
        chai.expect(config_1.httpConfig?.cert).to.eq("cert1");
        chai.expect(config_1.httpConfig?.pfx).to.eq("pfx1");
        chai.expect(config_1.httpConfig?.passphrase).to.eq("passphrase1");
    })
})