import * as path from "path";

import * as chai from "chai";

import { Core, LogLevelEnum, EventManager, EventManagerEnum } from "@webfaas/webfaas-core";

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
        await plugin.stopPlugin();
        await plugin.stopPlugin(); //retry stop
    })

    it("endpoint.http", async function(){
        let configData1 = {
            "endpoint":{
                "http": {
                    "port": 6010,
                    "hostname": "localhost1"
                }
            }
        }
        let config = new Config();
        config.read(configData1);
        let core1 = new Core( config );
        let plugin1: WebFassPlugin = new WebFassPlugin(core1);
        core1.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        chai.expect(plugin1.endPointHttp).to.not.null;
        if (plugin1.endPointHttp){
            chai.expect(plugin1.endPointHttp.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
            chai.expect(plugin1.endPointHttp.getConfig().port).to.eq(6010);
            chai.expect(plugin1.endPointHttp.getConfig().hostname).to.eq("localhost1");
        }
    })

    it("endpoint.https - httpConfig", async function(){
        let configData1 = {
            "endpoint":{
                "https": {
                    "port": 6011,
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
        chai.expect(plugin1.endPointHttps).to.not.null;
        if (plugin1.endPointHttps){
            chai.expect(plugin1.endPointHttps.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTPS);
            chai.expect(plugin1.endPointHttps.getConfig().port).to.eq(6011);
            chai.expect(plugin1.endPointHttps.getConfig().hostname).to.eq("localhost2");            
        }
    })

    it("endpoint.http - httpConfig whitout attr", async function(){
        let configData1 = {
            "endpoint":{
                "http": {
                    "port": 6012,
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
        chai.expect(plugin1.endPointHttp).to.not.null;
        if (plugin1.endPointHttp){
            chai.expect(plugin1.endPointHttp.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
            chai.expect(plugin1.endPointHttp.getConfig().port).to.eq(6012);
            chai.expect(plugin1.endPointHttp.getConfig().hostname).to.eq("localhost2");
        }
    })

    it("endpoint.http - CONFIG_RELOAD", async function(){
        let configData1 = {
            "endpoint":{
                "http": {
                    "port": 6013,
                    "hostname": "localhost3",
                    "route": {}
                }
            }
        }

        let configData2 = {
            "endpoint":{
                "http": {
                    "port": 6013,
                    "hostname": "localhost3",
                    "route": {"/route1":"/path1"}
                }
            }
        }

        let config = new Config();
        config.read(configData1);
        let core1 = new Core( config );
        
        let plugin1: WebFassPlugin = new WebFassPlugin(core1);
        core1.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        chai.expect(plugin1.endPointHttp).to.not.null;
        if (plugin1.endPointHttp){
            chai.expect(plugin1.endPointHttp.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
            chai.expect(plugin1.endPointHttp.getConfig().port).to.eq(6013);
            chai.expect(plugin1.endPointHttp.getConfig().hostname).to.eq("localhost3");
            chai.expect(plugin1.endPointHttp.getConfig().route["/route1"]).to.undefined;
        }

        config.read(configData2);
        EventManager.emit(EventManagerEnum.CONFIG_RELOAD);

        chai.expect(plugin1.endPointHttp).to.not.null;
        if (plugin1.endPointHttp){
            chai.expect(plugin1.endPointHttp.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTP);
            chai.expect(plugin1.endPointHttp.getConfig().port).to.eq(6013);
            chai.expect(plugin1.endPointHttp.getConfig().hostname).to.eq("localhost3");
            chai.expect(plugin1.endPointHttp.getConfig().route["/route1"]).to.eq("/path1");
        }
    })

    it("endpoint.https - httpConfig - default", async function(){
        let configData1 = {
            "endpoint":{
                "https": {
                    "port": 6014,
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
        chai.expect(plugin1.endPointHttps).to.not.null;
        if (plugin1.endPointHttps){
            chai.expect(plugin1.endPointHttps.getConfig().type).to.eq(EndPointHTTPConfigTypeEnum.HTTPS);
            chai.expect(plugin1.endPointHttps.getConfig().port).to.eq(6014);
            chai.expect(plugin1.endPointHttps.getConfig().hostname).to.eq("localhost2");            
        }
    })

    it("endpoint - disabled", async function(){
        let configData1 = {
            "endpoint":{
                "http": {
                    "disabled": true
                },
                "https": {
                    "disabled": true
                }
            }
        }
        let config = new Config();
        config.read(configData1);
        let core1 = new Core( config );
        let plugin1: WebFassPlugin = new WebFassPlugin(core1);
        core1.getLog().changeCurrentLevel(LogLevelEnum.OFF);
        chai.expect(plugin1.endPointHttp).to.null;
        chai.expect(plugin1.endPointHttps).to.null;
        await plugin1.startPlugin(core1);
        EventManager.emit(EventManagerEnum.CONFIG_RELOAD);
        await plugin1.stopPlugin();
    })
})