const fs = require("fs");
const { exec } = require('child_process');

const now = new Date();
const builtAt = now.toString();
const zipExtension = now.toISOString().replace(/-/g, "").replace(/:/g, "").replace("T", "-").replace(/\.|Z/g, "");

exec("git rev-parse HEAD", (err, stdout, stderr) => {
  const commitHash = stdout.trim() || "n/a";

  if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist");
  }

  fs.writeFileSync("./dist/build-info.json", JSON.stringify({
    builtAt,
    zipExtension,
    commitHash
  }, null, 2));

  const indexFile = fs.readFileSync("./index.html").toString()
    .replace(/\.zip/g, `-${zipExtension}.zip`)
    .replace("BUILD_INFO_HERE", `Built ${builtAt} &middot; <a href="https://github.com/concord-consortium/foss-simulations/commit/${commitHash}">${commitHash}</a>`)
  fs.writeFileSync("./dist/index.html", indexFile);
});

