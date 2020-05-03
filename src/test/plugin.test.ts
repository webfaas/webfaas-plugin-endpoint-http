import * as path from "path";

import * as chai from "chai";

import { Core, LogLevelEnum } from "@webfaas/webfaas-core";

import WebFassPlugin from "../lib/WebFassPlugin";
import { Config } from "@webfaas/webfaas-core/lib/Config/Config";
import { EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";

describe("Plugin", () => {
    it("start and stop - new", async function(){
        let core = new Core();
        let plugin = new WebFassPlugin(core);
        chai.expect(typeof(plugin)).to.eq("object");
        core.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        await plugin.startPlugin(core);
        await plugin.stopPlugin(core);
        await plugin.stopPlugin(core); //retry stop
    })

    it("endpoint.http", async function(){
        let configData1 = {
            "endpoint":{
                "http": {
                    "port": 9090,
                    "hostname": "localhost1"
                }
            }
        }
        let config = new Config();
        config.read(configData1);
        let core1 = new Core( config );
        let plugin1: WebFassPlugin = new WebFassPlugin(core1);
        core1.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        chai.expect(plugin1.endPointHttp.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
        chai.expect(plugin1.endPointHttp.getConfig().port).to.eq(9090);
        chai.expect(plugin1.endPointHttp.getConfig().hostname).to.eq("localhost1");
    })

    it("endpoint.https - httpConfig", async function(){
        let configData1 = {
            "endpoint":{
                "http": {
                    "port": 9092,
                    "hostname": "localhost2",
                    "httpConfig": {
                        ca: path.join(__dirname, "data", "crt", "cert.pem"),
                        cert: path.join(__dirname, "data", "crt", "cert.pem"),
                        pfx: path.join(__dirname, "data", "crt", "key.pem"),
                    }
                }
            }
        }

        let config = new Config();
        config.read(configData1);
        let core1 = new Core( config );

        let plugin1: WebFassPlugin = new WebFassPlugin(core1);
        core1.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        chai.expect(plugin1.endPointHttp.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTPS);
        chai.expect(plugin1.endPointHttp.getConfig().port).to.eq(9092);
        chai.expect(plugin1.endPointHttp.getConfig().hostname).to.eq("localhost2");
    })

    it("endpoint.https - httpConfig whitout attr", async function(){
        let configData1 = {
            "endpoint":{
                "http": {
                    "port": 9092,
                    "hostname": "localhost2",
                    "httpConfig": {
                    }
                }
            }
        }

        let config = new Config();
        config.read(configData1);
        let core1 = new Core( config );
        
        let plugin1: WebFassPlugin = new WebFassPlugin(core1);
        core1.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        chai.expect(plugin1.endPointHttp.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
        chai.expect(plugin1.endPointHttp.getConfig().port).to.eq(9092);
        chai.expect(plugin1.endPointHttp.getConfig().hostname).to.eq("localhost2");
    })
})