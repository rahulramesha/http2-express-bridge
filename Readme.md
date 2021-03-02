# Http2 Express Bridge

A wrapper to create a http2 server with express.js application

## Installation

Can be installed same as any other npm package.

Node.js version 10 or higher is recommended.

```bash
$ npm install http2-express-bridge
```

## Usage

```js
const express = require('express')
const http2Express = require('http2-express-bridge')
const http2 = require('http2')
const { readFileSync } = require('fs')

const app = http2Express(express)
const options = {
    key: readFileSync('<Certificate Key>'),
    cert: readFileSync('<Certificate file>'),
    allowHTTP1: true
};


app.get('/', function (req, res) {
  res.send('Hello World')
})

const server = http2.createSecureServer(options, app)

server.listen(3000, () => {
        console.log(`listening on port 3000`)
})
```
It will create a http2 server with all the perks of using http2 on supported browsers, but will revert back to Http1.1 on browsers that dont.
This should work out of the box without any further modification on your existing express application.

No Browser supports http2 without https connection. so the above approach is recommended. However, http2.createServer should also work, as long as https connection is used at the edges like HAProxy.

This can also be used as ESModules with 'import' syntax and Typescript (check examples folder).

## Server Push

One of the most hyped advantages of http2 is server push. To make it easier, push() method is added to the response.

```js
const express = require('express')
const http2Express = require('http2-express-bridge')
const http2 = require('http2')
const path = require('path')
const { readFileSync } = require('fs')

const app = http2Express(express)
const options = {
    key: readFileSync('<Certificate Key>'),
    cert: readFileSync('<Certificate file>'),
    allowHTTP1: true
};

// this will create a static path from which files are served
const staticPath = path.join(__dirname, '<Path>')

app.use(express.static(staticPath))

app.get('/bar', (req, res) => {

    // This accepts a single path or an array of paths. Path should be same as the ones in html below
    // Second argument is the Root directory from which the files are being served
    res.push(['/bar.js', '/foo.js'], staticPath)
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Bar Document</title>
            </head>
            <body>
                This is a bar document.
                <script src="/foo.js"></script>
                <script src="/bar.js"></script>
            </body>
        </html>`);
})

const server = http2.createSecureServer(options, app)

server.listen(3000, () => {
        console.log(`listening on port 3000`)
})
```
As seen in the example above, server push can be used. It is built on the belief that server push is a luxury not a necessity. Hence, if the browser does not accept push, or there is an error in the path, It will not crash the application but only throw an error.

On the topic of server push, lots of guidelines have to be followed to have actual performance gains. See [Rules of Thumb for HTTP/2 Push](https://docs.google.com/document/d/1K0NykTXBbbbTlv60t5MyJvXjqKGsCVNYHyLEXIxYMv0/edit?usp=sharing) for the details.

Without this guidelines, pushing files on every request even when the browser has cached the files will result in bad performance. [http2-express-autopush](https://www.npmjs.com/package/http2-express-autopush) is recommended to be used instead of programatically pushing the files. It is an expressjs middleware based on [h2-auto-push](https://www.npmjs.com/package/h2-auto-push). This middleware automatically pushes the files when required. You can learn more about it in the above two links.