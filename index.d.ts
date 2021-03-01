/// <reference types="express" />

import express, { Application} from 'express'
import http2 from 'http2'

// type definition of the module
declare function http2Express(exp: (typeof express)): Application


// Overriding Request and Response types from Express
declare global {
    namespace Express {
        export interface Response extends http2.Http2ServerResponse {
            push(path: string | string[], rootDir: string): void
        }
        export interface Request extends http2.Http2ServerRequest {}
    }
}

// Oveloading 'createServer' and 'createSecureServer' to accept type Application
declare module 'http2' {
    function createServer(onRequestHandler?: Application): http2.Http2Server;
    function createServer(options: http2.ServerOptions, onRequestHandler?: Application): http2.Http2Server;
    function createSecureServer(onRequestHandler?: Application): http2.Http2SecureServer;
    function createSecureServer(options: http2.SecureServerOptions, onRequestHandler?: Application): http2.Http2SecureServer;
}

export = http2Express