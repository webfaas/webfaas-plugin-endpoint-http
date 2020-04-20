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
        chai.expect(responseData).to.include("not found");

        //ERROR - METHOD NOT FOUND
        url = `${urlBase}/@registry1/math:sum22/1`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(404);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("not found");

        //ERROR - NAME OR VERSION REQUIRED
        url = `${urlBase}/math`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(400);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("required");

        //ERROR - PAYLOADINVALID - MODULE NAME
        url = `${urlBase}/@registry1/${Buffer.from(Buffer.alloc(257, "A"))}/1`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(400);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("PAYLOADINVALID");

        //ERROR - NAME OR VERSION REQUIRED - CONTEXT EMPTY
        url = `${urlBase}`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(400);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("required");

        //ERROR - NAME OR VERSION REQUIRED - PAYLOAD UNDEFINED
        url = `${urlBase}`;
        response = await clientHTTP.request(url, "POST", undefined, {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(400);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("required");

        //ERROR - NAME OR VERSION REQUIRED - CONTENT-TYPE text/html
        url = `${urlBase}`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {"content-type": "text/html"});
        chai.expect(response.statusCode).to.eq(400);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("required");

        //ERROR - NAME OR VERSION REQUIRED - CONTENT-TYPE EMPTY
        url = `${urlBase}`;
        response = await clientHTTP.request(url, "POST", Buffer.from(JSON.stringify({x:2,y:3})), {});
        chai.expect(response.statusCode).to.eq(400);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("required");

        //ERROR - BODY JSON PARSE ERROR
        url = `${urlBase}`;
        response = await clientHTTP.request(url, "POST", Buffer.from("{ZZZZZZ"), {"content-type": "application/json"});
        chai.expect(response.statusCode).to.eq(400);
        responseData = response.data.toString();
        chai.expect(responseData).to.include("Parse");

        await endPointHTTP.stop();
    })
})