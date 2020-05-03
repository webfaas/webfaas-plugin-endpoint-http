import * as fs from "fs";
import * as path from "path";
import { IPackageStoreItemData, IPackageRegistryResponse, PackageStore } from "@webfaas/webfaas-core";

export namespace PackageRegistryResponseMock{
    function addItemData(name: string, begin: number, fileBuffer: Buffer, dataPackageItemDataMap: Map<string, IPackageStoreItemData>){
        let itemData = {} as IPackageStoreItemData;
        itemData.begin = begin;
        itemData.name = name;
        itemData.size = fileBuffer.length;
        dataPackageItemDataMap.set(itemData.name, itemData);
        return begin + fileBuffer.length;
    }

    export class Manifest implements IPackageRegistryResponse{
        etag: string;
        packageStore: PackageStore | null = null;
    
        constructor(name: string, versions: string[] = ["0.0.1"], description: string = "test"){
            this.etag = "001";
            
            var itemData: IPackageStoreItemData;
            var dataPackageItemDataMap: Map<string, IPackageStoreItemData> = new Map<string, IPackageStoreItemData>();
            var nextPos: number = 0;
            
            var manifestVersionsObj: any = {};
            for (var i = 0; i < versions.length; i++){
                let version = versions[i];
                manifestVersionsObj[version] = {name:name, version:version, main:"index.js", description: description};
            }
            
            var packageObj = {name:name, main:"index.js", versions: manifestVersionsObj, description: description};
            var packageBuffer = Buffer.from(JSON.stringify(packageObj));
            nextPos = addItemData("package.json", nextPos, packageBuffer, dataPackageItemDataMap);

            this.packageStore = new PackageStore(name, "", this.etag, packageBuffer, dataPackageItemDataMap);
        }
    }

    export class AbstractBase implements IPackageRegistryResponse{
        etag: string;
        packageStore: PackageStore | null = null;
    
        constructor(name: string, version: string, description: string, moduleTextOrBuffer: string | Buffer, fileMainName: string = "index.js"){
            this.etag = "etag" + version;
            
            var itemData: IPackageStoreItemData;
            var dataPackageItemDataMap: Map<string, IPackageStoreItemData> = new Map<string, IPackageStoreItemData>();
            var nextPos: number = 0;

            let packageObj = {name:name, version:version, main:fileMainName, description: description};
            let packageBuffer = Buffer.from(JSON.stringify(packageObj));
            nextPos = addItemData("package.json", nextPos, packageBuffer, dataPackageItemDataMap);

            let file1Buffer: Buffer;
            if (Buffer.isBuffer(moduleTextOrBuffer)){
                file1Buffer = moduleTextOrBuffer;
            }
            else{
                file1Buffer = Buffer.from(moduleTextOrBuffer);
            }
            nextPos = addItemData(fileMainName, nextPos, file1Buffer, dataPackageItemDataMap);
    
            var bufferTotal: Buffer = Buffer.concat([packageBuffer, file1Buffer]);
    
            this.packageStore = new PackageStore(name, version, this.etag, bufferTotal, dataPackageItemDataMap);
        }
    }

    export class Math implements IPackageRegistryResponse{
        etag: string;
        packageStore: PackageStore | null = null;
    
        constructor(name: string = "math", version: string = "0.0.1", description: string = "test"){
            this.etag = "etag" + version;
            
            var itemData: IPackageStoreItemData;
            var dataPackageItemDataMap: Map<string, IPackageStoreItemData> = new Map<string, IPackageStoreItemData>();
            var nextPos: number = 0;

            let packageObj = {name:name, version:version, main:"index.js", description: description};
            let packageBuffer = Buffer.from(JSON.stringify(packageObj));
            nextPos = addItemData("package.json", nextPos, packageBuffer, dataPackageItemDataMap);

            let moduleText = `
            module.exports.sum = async function(event){
                return {payload: event.payload.x + event.payload.y};
            }
            module.exports.sumsync = function(event){
                return {payload: event.payload.x + event.payload.y};
            }
            module.exports.multiply = async function(event){
                return {payload: event.payload.x * event.payload.y};
            }
            module.exports.multiplysync = function(event){
                return {payload: event.payload.x * event.payload.y};
            }
            module.exports.null = function(event){
                return null;
            }
            module.exports.errorasync = async function(event){
                throw new Error("errorasync");
            }
            `
            
            let file1Buffer = Buffer.from(moduleText);
            nextPos = addItemData("index.js", nextPos, file1Buffer, dataPackageItemDataMap);
    
            var bufferTotal: Buffer = Buffer.concat([packageBuffer, file1Buffer]);
    
            this.packageStore = new PackageStore(name, version, this.etag, bufferTotal, dataPackageItemDataMap);
        }
    }
}