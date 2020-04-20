import { PackageRegistryResponseMock } from "./PackageRegistryResponseMock";
import { IPackageRegistry, IPackageRegistryResponse } from "@webfaas/webfaas-core";

export namespace PackageRegistryMock{
    abstract class AbstractPackageRegistry implements IPackageRegistry {
        public listPackageRegistryResponse: Map<string, IPackageRegistryResponse> = new Map<string, IPackageRegistryResponse>();
        
        abstract getTypeName(): string

        getManifest(name: string, etag?: string): Promise<IPackageRegistryResponse> {
            return new Promise((resolve, reject)=>{
                let responseObj = this.listPackageRegistryResponse.get(name);
                if (responseObj){
                    resolve(responseObj);
                }
                else{
                    let responseNotFoundObj = {} as IPackageRegistryResponse;
                    responseNotFoundObj.packageStore = null;
                    responseNotFoundObj.etag = "";
                    resolve(responseNotFoundObj);
                }
            });
        }
        
        getPackage(name: string, version: string, etag?: string): Promise<IPackageRegistryResponse>{
            return new Promise((resolve, reject)=>{
                let responseObj = this.listPackageRegistryResponse.get(name + ":" + version) || null;
                if (responseObj){
                    resolve(responseObj);
                }
                else{
                    let responseNotFoundObj = {} as IPackageRegistryResponse;
                    responseNotFoundObj.packageStore = null;
                    responseNotFoundObj.etag = "";
                    resolve(responseNotFoundObj);
                }
            });
        }

        async start() {
        }

        async stop() {
        }
    }
    
    export class PackageRegistry1 extends AbstractPackageRegistry {
        getTypeName(): string{
            return "REGISTRY1";
        }
        
        constructor(){
            super();
            
            let nameMathSumAsync:string = "@registry1/math";
            
            let description: string = "registry1 mock";

            this.listPackageRegistryResponse.set(nameMathSumAsync, new PackageRegistryResponseMock.Manifest(nameMathSumAsync, ["1.0.0", "2.0.0"], description));
            this.listPackageRegistryResponse.set(nameMathSumAsync + ":1.0.0", new PackageRegistryResponseMock.Math(nameMathSumAsync, "1.0.0", description));
            this.listPackageRegistryResponse.set(nameMathSumAsync + ":2.0.0", new PackageRegistryResponseMock.Math(nameMathSumAsync, "2.0.0", description));
        }
    }
}