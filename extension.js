module.exports = nodecg => {
    // this whole thing is dumb ugh
    const ext = require("./extension-build/extension-src");
    ext.init(nodecg, __dirname);
};
