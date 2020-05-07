import * as fs from "fs";
import { Core, IPlugin, EventManager, EventManagerEnum } from "@webfaas/webfaas-core";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "./EndPointHTTPConfig";
import { EndPointHTTP } from "./EndPointHTTP";

export default class WebFassPlugin implements IPlugin {
    endPointHttp: EndPointHTTP
    core: Core;
    
    async startPlugin(core: Core) {
        await this.endPointHttp.start();
    }

    async stopPlugin(core: Core) {
        await this.endPointHttp.stop();
    }

    readCert(file: string): Buffer{
        return fs.readFileSync(file);
    }

    onConfigReload(){
        let config = this.endPointHttp.getConfig();
        config.route = this.core.getConfig().get("endpoint.http.route", {});
    }

    constructor(core: Core){
        this.core = core;
        
        let itemConfig: any = core.getConfig().get("endpoint.http", {});

        let config = new EndPointHTTPConfig();
        config.type = EndPointHTTPConfigTypeEnum.HTTP;
        config.port = itemConfig.port || 8080;
        config.hostname = itemConfig.hostname;
        config.httpConfig = itemConfig.httpConfig || null;

        config.route = this.core.getConfig().get("endpoint.http.route", {});

        if (config.httpConfig){
            if (config.httpConfig.ca){
                config.type = EndPointHTTPConfigTypeEnum.HTTPS;
                config.httpConfig.ca = this.readCert(config.httpConfig.ca.toString());
            }
            if (config.httpConfig.cert){
                config.type = EndPointHTTPConfigTypeEnum.HTTPS;
                config.httpConfig.cert = this.readCert(config.httpConfig.cert.toString());
            }
            if (config.httpConfig.pfx){
                config.type = EndPointHTTPConfigTypeEnum.HTTPS;
                config.httpConfig.pfx = this.readCert(config.httpConfig.pfx.toString());
            }
        }

        this.endPointHttp = new EndPointHTTP(core, config);

        this.onConfigReload = this.onConfigReload.bind(this);
        EventManager.addListener(EventManagerEnum.CONFIG_RELOAD, this.onConfigReload);
    }
}