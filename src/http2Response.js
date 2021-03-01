const Http2ServerResponse = require('http2').Http2ServerResponse
const path = require('path')
const mixin = require('merge-descriptors')
const mime = require('send').mime

const isStringArray = require('./util.js').isStringArray

module.exports = createHttp2Response

function createHttp2Response(response) {

    const http2Response = Object.create(Http2ServerResponse.prototype)
    mixin(http2Response, response, false)

    http2Response.push = async function(paths, rootDir) {
        const self = this;

        if(!self.stream) return;

        if (!paths) {
            console.error('paths argument is required to push')
            return
        }

        if(typeof paths !== 'string' && !isStringArray(paths)) {
            console.error('paths argument should either be a string or an array of strings')
            return
        }

        if (!rootDir) {
            console.error('root argument is required to identify the path')
            return
        }

        if (typeof rootDir !== 'string') {
            console.error('root argument is should be a string')
            return
        }

        const root = path.resolve(rootDir)

        const pathList = typeof paths === 'string' ? [paths]: paths
        
        const pushPromises = pathList.map( (fpath) => {
            return new Promise((resolve, reject) => {
                try {
                    const filePath = path.join(root, fpath);

                    const pushFile = (pushStream) => {
                        
                        const onFinish = () => {
                            pushStream.removeListener('error', onError)
                            resolve()
                        };

                        const onError = (err) => {
                            pushStream.removeListener('finish', onFinish)
                            pushStream.end();
                            reject(err);
                        };

                        pushStream.once('error', onError);
                        pushStream.once('finish', onFinish);
                        
                        if(!pushStream.destroyed) {
                            pushStream.respondWithFile(filePath, 
                                {'content-type': mime.lookup(filePath)}, 
                                {
                                statCheck: (stats) => {
                                    return stats.isFile()
                                },
                                onError: onError
                            })
                        }
                    }
                
                    
                    if(self.stream.pushAllowed) {
                        self.stream.pushStream(
                            {':path': fpath, 'content-type': mime.lookup(filePath)},
                            (err, pushStream) => {
                                if (err) {
                                    return reject(err);
                                }
                                pushFile(pushStream);
                            }
                        )
                    } else throw new Error(`push is not Allowed, ${fpath}`)
                    
                } catch(err) {
                    reject(err)
                }
                
                
            })
        })

        try {
            await Promise.all(pushPromises);
        } catch(err) {
            console.error(err.message)
        }

    }

    return http2Response
}