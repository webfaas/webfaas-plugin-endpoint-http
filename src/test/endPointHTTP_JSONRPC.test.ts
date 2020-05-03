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

describe("EndPointHTTP - JSON RPC", () => {
    it("/@registry1/math:sum/1", async function(){
        const configEndPointHTTP = new EndPointHTTPConfig();
        configEndPointHTTP.port = 7094;
        const endPointHTTP = new EndPointHTTP(core, configEndPointHTTP);
        const urlBase = "http://localhost:" + configEndPointHTTP.port;
        await endPointHTTP.start();

        //SUCESS
        let msgRequest1 = {} as any;
        msgRequest1.id = 1
        msgRequest1.method = "@registry1/math:sum/1"
        msgRequest1.params = {x:2,y:3};
        let response1 = await clientHTTP.request(urlBase, "POST", Buffer.from(JSON.stringify(msgRequest1)), {"content-type": "application/json-rpc"});
        let responseData1 = JSON.parse(response1.data.toString());
        chai.expect(response1.statusCode).to.eq(200);
        chai.expect(responseData1.id).to.eq(msgRequest1.id);
        chai.expect(responseData1.result).to.eq(5);

        //ERROR - MODULE NOT FOUND
        let msgRequest2 = {} as any;
        msgRequest2.method = "@registry1/not_found_math:sum/1"
        msgRequest2.params = {x:2,y:3};
        let response2 = await clientHTTP.request(urlBase, "POST", Buffer.from(JSON.stringify(msgRequest2)), {"content-type": "application/json-rpc"});
        let responseData2 = JSON.parse(response2.data.toString());
        chai.expect(response2.statusCode).to.eq(200);
        chai.expect(responseData2.error.code).to.eq(-32601);

        //ERROR - PARSE
        let response3 = await clientHTTP.request(urlBase, "POST", Buffer.from("AAA---"), {"content-type": "application/json-rpc"});
        let responseData3 = JSON.parse(response3.data.toString());
        chai.expect(response3.statusCode).to.eq(200);
        chai.expect(responseData3.error.code).to.eq(-32600);

        //ERROR - MSG NULL
        let response4 = await clientHTTP.request(urlBase, "POST", Buffer.from('{"method":"method1"}') as any, {"content-type": "application/json-rpc"});
        let responseData4 = JSON.parse(response4.data.toString());
        chai.expect(response4.statusCode).to.eq(200);
        chai.expect(responseData4.error.code).to.eq(-32600);

        //SUCESS - RETURN NULL
        let msgRequest5 = {} as any;
        msgRequest5.id = 2
        msgRequest5.method = "@registry1/math:null/1"
        msgRequest5.params = {x:2,y:3};
        let response5 = await clientHTTP.request(urlBase, "POST", Buffer.from(JSON.stringify(msgRequest5)), {"content-type": "application/json-rpc"});
        let responseData5 = JSON.parse(response5.data.toString());
        chai.expect(response5.statusCode).to.eq(200);
        chai.expect(responseData5.id).to.eq(msgRequest5.id);
        chai.expect(responseData5.result).to.null;

        //SUCESS - RETURN THROW
        let msgRequest6 = {} as any;
        msgRequest6.id = 3
        msgRequest6.method = "@registry1/math:errorasync/1"
        msgRequest6.params = {x:2,y:3};
        let response6 = await clientHTTP.request(urlBase, "POST", Buffer.from(JSON.stringify(msgRequest6)), {"content-type": "application/json-rpc"});
        let responseData6 = JSON.parse(response6.data.toString());
        chai.expect(response6.statusCode).to.eq(200);
        chai.expect(responseData6.error.code).to.eq(-32000);

        await endPointHTTP.stop();
    })
})