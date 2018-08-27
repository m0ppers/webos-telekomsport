import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import { service } from './services/telekom';

// Create Express server
const app = express();
app.set("port", process.env.PORT || 5102);
app.use(bodyParser.json());

app.post('/telekomservice/:serviceMethod', (req: Request, res: Response) => {
    const fn: Function = (service as any)[req.params['serviceMethod']];
    if (fn) {
        fn.apply(service, req.body)
        .then((result: any) => {
            res.json(result);
        }, (error: any) => {
            res.status(500);
            res.json(error);
        })
    } else {
        res.sendStatus(404);
    }
});

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});
  
export default server;