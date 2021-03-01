const mixin = require('merge-descriptors')
const EventEmitter = require ('events')

const createHttp2Request = require('./http2Request.js')
const createHttp2Response = require('./http2Response.js')
const initMiddleware = require('./initMiddleware.js')

module.exports = createH2ExpressBridge

function createH2ExpressBridge(express) {
    const { application, request, response, Router, query } = express;

    application.lazyrouter = function lazyrouter() {
        if (!this._router) {
          this._router = new Router({
            caseSensitive: this.enabled('case sensitive routing'),
            strict: this.enabled('strict routing')
          });
      
          this._router.use(query(this.get('query parser fn')));
          this._router.use(initMiddleware(this));
        }
    }

    const app = function(req, res, next) {
        const { socket } = req.httpVersion === '2.0' ?
                                req.stream.session : req;

        //Checking alpnProtocol for http2
        app.handle(req, res, next);
    };
    
    mixin(app, EventEmitter.prototype, false);
    mixin(app, application, false);
    
    response.push = () => {}
    // expose the prototype that will get set on requests
    app.request = Object.create(request, {
        app: { configurable: true, enumerable: true, writable: true, value: app }
    })
    
    // expose the prototype that will get set on responses
    app.response = Object.create(response, {
        app: { configurable: true, enumerable: true, writable: true, value: app }
    })

    const http2Request  = createHttp2Request(request)
    const http2Response = createHttp2Response(response)

    app.http2Request = Object.create(http2Request, {
        app: { configurable: true, enumerable: true, writable: true, value: app }
    })

    app.http2Response = Object.create(http2Response, {
        app: { configurable: true, enumerable: true, writable: true, value: app }
    })

    app.init();

    return app;
}





