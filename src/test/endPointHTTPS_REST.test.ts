import * as chai from "chai";
import * as fs from "fs";
import * as path from "path";

import { Log, LogLevelEnum, Core, ClientHTTP, IClientHTTPResponse, ClientHTTPConfig } from "@webfaas/webfaas-core";

import { EndPointHTTP } from "../lib/EndPointHTTP";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";
import { PackageRegistryMock } from "./mocks/PackageRegistryMock";

const core = new Core();
const log = new Log();
const configClientHTTP = new ClientHTTPConfig();
configClientHTTP.cert = fs.readFileSync(path.join(__dirname, "./data/crt/cert.pem"));
configClientHTTP.rejectUnauthorized = false;
log.changeCurrentLevel(LogLevelEnum.INFO);
core.getModuleManager().getModuleManagerImport().getPackageStoreManager().getPackageRegistryManager().addRegistry("mock", "", new PackageRegistryMock.PackageRegistry1());
const clientHTTP: ClientHTTP = new ClientHTTP(configClientHTTP, log);

describe("EndPointHTTPS - REST", () => {
    it("/@registry1/math:sum/1", async function(){
        const configEndPointHTTP = new EndPointHTTPConfig();
        configEndPointHTTP.httpConfig = {};
        configEndPointHTTP.httpConfig.key = fs.readFileSync(path.join(__dirname, "./data/crt/key.pem"));
        configEndPointHTTP.httpConfig.cert = fs.readFileSync(path.join(__dirname, "./data/crt/cert.pem"));
        
        configEndPointHTTP.port = 9096;
        configEndPointHTTP.type = EndPointHTTPConfigTypeEnum.HTTPS;
        const endPointHTTP = new EndPointHTTP(core, configEndPointHTTP);
        const urlBase = "https://localhost:" + configEndPointHTTP.port;
        let url: string;
        let response: IClientHTTPResponse;
        let responseData: any;
        await endPointHTTP.start();

        //SUCESS
        url = `${urlBase}/@registry1/math:sum/1`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(200);
        responseData = JSON.parse(response.data.toString());
        chai.expect(responseData).to.eq(5);

        await endPointHTTP.stop();
    })

    it("error - certificate", async function(){
        const configEndPointHTTP = new EndPointHTTPConfig();
        configEndPointHTTP.httpConfig = {};
        configEndPointHTTP.httpConfig.key = fs.readFileSync(path.join(__dirname, "./data/crt/key.pem"));
        configEndPointHTTP.httpConfig.cert = Buffer.from("AA");
        
        configEndPointHTTP.port = 9098;
        configEndPointHTTP.type = EndPointHTTPConfigTypeEnum.HTTPS;
        const endPointHTTP = new EndPointHTTP(core, configEndPointHTTP);
        
        try {
            await endPointHTTP.start();
            throw new Error("Sucess");
        }
        catch (errTry) {
            chai.expect(errTry.message).to.include("PEM");
        }

        await endPointHTTP.stop();
    })
})