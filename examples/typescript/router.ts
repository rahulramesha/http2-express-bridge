import {Router, Request, Response} from 'express'
import path from 'path'

const router = Router()

const staticPath = path.join(process.cwd(), './statics')

router.get('/bar', (req: Request, res: Response) => {

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

export default router