const setPrototypeOf = require('setprototypeof')

module.exports = initMiddleware

function initMiddleware (app) {
    return function expressInit(req, res, next){
        if (app.enabled('x-powered-by')) res.setHeader('X-Powered-By', 'Express with http2-express-bridge');
        req.res = res;
        res.req = req;
        req.next = next;

        const alpnProtocol = req?.stream?.session?.alpnProtocol;

        //Checking alpnProtocol for http2
        if (alpnProtocol === 'h2' || alpnProtocol === 'h2c') {
            setPrototypeOf(req, app.http2Request)
            setPrototypeOf(res, app.http2Response)
        } else {
            setPrototypeOf(req, app.request)
            setPrototypeOf(res, app.response)
        }

        res.locals = res.locals || Object.create(null);

        next();
    };
}