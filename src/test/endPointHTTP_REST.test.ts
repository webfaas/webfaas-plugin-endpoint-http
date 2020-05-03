import * as chai from "chai";

import { Log, LogLevelEnum, Core, ClientHTTP, IClientHTTPResponse } from "@webfaas/webfaas-core";

import { EndPointHTTP } from "../lib/EndPointHTTP";
import { EndPointHTTPConfig, EndPointHTTPConfigTypeEnum } from "../lib/EndPointHTTPConfig";
import { PackageRegistryMock } from "./mocks/PackageRegistryMock";

const core = new Core();
const log = new Log();
log.changeCurrentLevel(LogLevelEnum.INFO);
core.getModuleManager().getModuleManagerImport().getPackageStoreManager().getPackageRegistryManager().addRegistry("mock", "", new PackageRegistryMock.PackageRegistry1());
const clientHTTP: ClientHTTP = new ClientHTTP(undefined, log);

describe("EndPointHTTP - REST", () => {
    it("/@registry1/math:sum/1", async function(){
        const configEndPointHTTP = new EndPointHTTPConfig();
        configEndPointHTTP.port = 9094;
        const endPointHTTP = new EndPointHTTP(core, configEndPointHTTP);
        const urlBase = "http://localhost:" + configEndPointHTTP.port;
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

        //ERROR - MODULE NOT FOUND
        url = `${urlBase}/@registry1/math22:sum/1`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(404);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("NOT FOUND");

        //RETURN THROW
        url = `${urlBase}/@registry1/math:errorasync/1`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(500);

        await endPointHTTP.stop();
    })

    it("/@registry1/math:sum/1 - with httpConfig", async function(){
        const configEndPointHTTP = new EndPointHTTPConfig();
        configEndPointHTTP.port = 9095;
        configEndPointHTTP.httpConfig = {};
        const endPointHTTP = new EndPointHTTP(core, configEndPointHTTP);
        const urlBase = "http://localhost:" + configEndPointHTTP.port;
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

        //ERROR - MODULE NOT FOUND
        url = `${urlBase}/@registry1/math22:sum/1`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(404);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("NOT FOUND");

        await endPointHTTP.stop();
    })
})