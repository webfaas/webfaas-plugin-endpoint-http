"use strict";

import { Core } from "@webfaas/webfaas-core";
import { PackageRegistryMock } from "../test/mocks/PackageRegistryMock";

var core = new Core();
core.getModuleManager().getModuleManagerImport().getPackageStoreManager().getPackageRegistryManager().addRegistry("mock", "", new PackageRegistryMock.PackageRegistry1());

(async function(){
    try {
        let msg = {} as any //IMessage
        msg.header = {};
        msg.header.name = "@registry1/math";
        msg.header.version = "1.0.0";
        msg.header.method = "sum";
        msg.payload = {x:2, y:3};
        var response: any = await core.sendMessage(msg);

        console.log("response => ", response);
    }
    catch (errTry) {
        console.log("errExample: ", errTry);
    }
})();