# WebFaas - Plugin - Endpoint - HTTP

WebFaaS Plugin for [node](http://nodejs.org).

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

### Config - Simple
```json
{
    "endpoint.http": [
        {
            "port": "[http port]"
        }
    ]
}
```


### Config - Complete
```json
{
    "endpoint.http": [
        {
            "port": "[http port]",
            "hostname": "[http hostname]",
            "httpConfig": {
                "ca": "[location ca]",
                "cert": "[location cert]",
                "pfx": "[location pfx]"
            }
        }
    ]
}
```

### Example
```shell
curl -XPOST "http://localhost:8080/@registry1/math:multiply/1" -H "content-type:application/json" -d '{"x":2,"y":3}'
```

```shell
curl -XPOST "http://localhost:8080/@webfaaslabs/math:sum/0" -H "content-type:application/json" -d '{"x":2,"y":3}' -v
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/@webfaas/webfaas-plugin-endpoint-http.svg
[npm-url]: https://npmjs.org/package/@webfaas/webfaas-plugin-endpoint-http

[travis-image]: https://img.shields.io/travis/webfaas/webfaas-plugin-endpoint-http/master.svg?label=linux
[travis-url]: https://travis-ci.org/webfaas/webfaas-plugin-endpoint-http

[coveralls-image]: https://img.shields.io/coveralls/github/webfaas/webfaas-plugin-endpoint-http/master.svg
[coveralls-url]: https://coveralls.io/github/webfaas/webfaas-plugin-endpoint-http?branch=master