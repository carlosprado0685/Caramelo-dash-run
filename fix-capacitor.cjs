const fs = require("fs");

const shell = ".output/public/_shell.html";
const index = ".output/public/index.html";

if (!fs.existsSync(shell)) {
  console.error("ERRO: _shell.html não foi encontrado.");
  process.exit(1);
}

fs.copyFileSync(shell, index);
console.log("OK: index.html criado para o Capacitor.");