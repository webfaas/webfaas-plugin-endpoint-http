"use strict";

import { Core } from "@webfaas/webfaas-core";
import { PackageRegistryMock } from "../test/mocks/PackageRegistryMock";
import WebFassPlugin from "../lib/WebFassPlugin";

var core = new Core();
core.getModuleManager().getModuleManagerImport().getPackageStoreManager().getPackageRegistryManager().addRegistry("mock", "", new PackageRegistryMock.PackageRegistry1());

let plugin = new WebFassPlugin(core);
plugin.startPlugin(core);