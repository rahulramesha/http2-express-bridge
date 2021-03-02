import express, {Request, Response } from 'express'
import path from 'path'

import expressHttp2Bridge from 'http2-express-bridge'

import route from './router'

const staticPath = path.join(process.cwd(), './statics')
const app = expressHttp2Bridge(express)

app.use(express.static(staticPath))

app.get('/path', (req: Request, res: Response) => {
    const context = { site: req.hostname.split(".")[0] }

    res.send(`Hi There, ${context.site}`);
})

app.use(route)

export default app
