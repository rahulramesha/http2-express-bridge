import http2 from 'http2'
import { readFileSync } from 'fs'

import app from './app'

const PORT =  5000

let certs = {
    key: readFileSync('C:/test/privateKey.key'),
    cert: readFileSync('C:/test/certificate.crt'),
    allowHTTP1: true
};

const server = http2.createSecureServer(certs, app)

server.listen(PORT, ()=> {console.log(`listening on port ${PORT}`)})