import { ServerOptions } from "https";

export enum EndPointHTTPConfigTypeEnum{
    HTTP="HTTP",
    HTTPS="HTTPS"
}

export interface EndPointHTTPConfigRoute{
    [path: string]: string
}

export class EndPointHTTPConfig  {
    port: number
    hostname?: string
    type: EndPointHTTPConfigTypeEnum
    httpConfig: ServerOptions | null
    route: EndPointHTTPConfigRoute = {}

    constructor(port?: number, hostname?: string, type?: EndPointHTTPConfigTypeEnum, httpConfig?: ServerOptions){
        if (port){
            this.port = port;
        }
        else{
            this.port = 8080;
        }

        this.hostname = hostname;

        if (type){
            this.type = type;
        }
        else{
            this.type = EndPointHTTPConfigTypeEnum.HTTP;
        }

        this.httpConfig = httpConfig || null;
    }
}