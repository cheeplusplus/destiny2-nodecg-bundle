// manual run server-side: fetch new asset bundles

const path = require("path");
const fs = require("fs-extra");
const superagent = require("superagent");
const unzipper = require("unzipper");

const BaseUrl = "https://www.bungie.net";

async function fetch(path) {
    const req = superagent.get(BaseUrl + path);
    const res = await req;
    return res.body;
}

async function fetchAndUnzip(path) {
    return new Promise((resolve, reject) => {
        const req = superagent.get(BaseUrl + path);
        const s = req.pipe(unzipper.Extract({ path: __dirname }));
        s.on("finish", () => {
            resolve();
        });
        s.on("error", err => {
            reject(err);
        });
    });
}

async function main() {
    const manifest = await fetch("/Platform/Destiny2/Manifest/");
    if (!manifest || !manifest.Response) {
        throw new Error("Invalid manifest.");
    }

    const fileUrl = manifest["Response"]["mobileWorldContentPaths"]["en"];
    const fileName = path.join(__dirname, path.basename(fileUrl));
    const simpleFilename = path.join(__dirname, "world_sql_content.content");

    await fetchAndUnzip(fileUrl);
    await fs.rename(fileName, simpleFilename);

    console.log("Done.");
}

main().catch(err => {
    console.error(err);
});
