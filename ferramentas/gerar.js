// Gera as páginas das receitas a partir do modelo. Correr: node gerar.js <pasta do site>
const fs = require("fs"), path = require("path");
const site = process.argv[2];
const { RECEITAS } = require(path.join(site, "js/receitas.js"));
const tpl = fs.readFileSync(path.join(__dirname, "pagina.tpl"), "utf8");
for (const r of RECEITAS) {
  const html = tpl.replace(/\{ID\}/g, r.id).replace(/\{NOME\}/g, r.nome).replace(/\{SUB\}/g, r.subtitulo)
    .replace(/\{IMG\}/g, r.imagem).replace(/\{COR\}/g, r.cor).replace(/\{SUAVE\}/g, r.corSuave);
  fs.writeFileSync(path.join(site, r.pagina), html);
  console.log("criada", r.pagina);
}
