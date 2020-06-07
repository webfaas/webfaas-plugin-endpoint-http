import * as fs from "fs";
import * as path from "path";
import { Core, IPlugin, EventManager, EventManagerEnum } from "@webfaas/webfaas-core";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "./EndPointHTTPConfig";
import { EndPointHTTP } from "./EndPointHTTP";

export default class WebFassPlugin implements IPlugin {
    endPointHttp: EndPointHTTP | null = null;
    endPointHttps: EndPointHTTP | null = null;
    core: Core;
    
    async startPlugin(core: Core) {
        if (this.endPointHttp){
            await this.endPointHttp.start();
        }
        if (this.endPointHttps){
            await this.endPointHttps.start();
        }
    }

    async stopPlugin() {
        if (this.endPointHttp){
            await this.endPointHttp.stop();
        }
        if (this.endPointHttps){
            await this.endPointHttps.stop();
        }
    }

    readCert(file: string): Buffer{
        return fs.readFileSync(file);
    }

    onConfigReload(){
        if (this.endPointHttp){
            let configHTTP = this.endPointHttp.getConfig();
            configHTTP.route = this.core.getConfig().get("endpoint.http.route", {});
        }

        if (this.endPointHttps){
            let configHTTPS = this.endPointHttps.getConfig();
            configHTTPS.route = this.core.getConfig().get("endpoint.https.route", {});
        }
    }

    constructor(core: Core){
        this.core = core;
        
        let itemConfigHTTP: any = this.core.getConfig().get("endpoint.http", {});
        if (!itemConfigHTTP.disabled){
            let configHTTP = new EndPointHTTPConfig();
            configHTTP.type = EndPointHTTPConfigTypeEnum.HTTP;
            configHTTP.port = itemConfigHTTP.port || 8080;
            configHTTP.hostname = itemConfigHTTP.hostname;
            configHTTP.httpConfig = itemConfigHTTP.httpConfig || null;
            configHTTP.route = this.core.getConfig().get("endpoint.http.route", {});
            this.endPointHttp = new EndPointHTTP(core, configHTTP);
        }

        let itemConfigHTTPS: any = this.core.getConfig().get("endpoint.https", {});
        if (!itemConfigHTTPS.disabled){
            let configHTTPS = new EndPointHTTPConfig();
            configHTTPS.type = EndPointHTTPConfigTypeEnum.HTTPS;
            configHTTPS.port = itemConfigHTTPS.port || 8443;
            configHTTPS.hostname = itemConfigHTTPS.hostname;
            configHTTPS.httpConfig = itemConfigHTTPS.httpConfig || null;
            configHTTPS.route = this.core.getConfig().get("endpoint.https.route", {});
            if (configHTTPS.httpConfig){
                if (configHTTPS.httpConfig.ca){
                    configHTTPS.httpConfig.ca = this.readCert(configHTTPS.httpConfig.ca.toString());
                }
                if (configHTTPS.httpConfig.cert){
                    configHTTPS.httpConfig.cert = this.readCert(configHTTPS.httpConfig.cert.toString());
                }
                if (configHTTPS.httpConfig.pfx){
                    configHTTPS.httpConfig.pfx = this.readCert(configHTTPS.httpConfig.pfx.toString());
                }
            }
            else{
                configHTTPS.httpConfig = {};
                configHTTPS.httpConfig.pfx = this.readCert(path.join(__dirname, "../ssl", "cert.p12"));
                configHTTPS.httpConfig.passphrase = "changeit";
            }
            this.endPointHttps = new EndPointHTTP(core, configHTTPS);            
        }

        this.onConfigReload = this.onConfigReload.bind(this);
        EventManager.addListener(EventManagerEnum.CONFIG_RELOAD, this.onConfigReload);
    }
}