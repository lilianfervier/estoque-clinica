let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let historico = JSON.parse(localStorage.getItem("historico")) || [];
let filtroBaixo = false;
let modoCheck = false;

function salvar() {
localStorage.setItem("produtos", JSON.stringify(produtos));
localStorage.setItem("historico", JSON.stringify(historico));
}

function dataAgora() {
return new Date().toLocaleString("pt-BR");
}

function adicionarProduto() {
const nome = nomeProduto.value;
const qtd = parseInt(quantidadeProduto.value);

if (!nome) return;

produtos.push({
nome,
quantidade: qtd,
data: dataAgora()
});

salvar();
render();
}

function alterar(i, valor) {
let antes = produtos[i].quantidade;

produtos[i].quantidade += valor;
produtos[i].data = dataAgora();

historico.unshift({
produto: produtos[i].nome,
antes,
depois: produtos[i].quantidade,
data: dataAgora()
});

salvar();
render();
}

function filtrarBaixo() {
filtroBaixo = !filtroBaixo;
render();
}

function modoConferencia() {
modoCheck = !modoCheck;
alert("Modo conferência " + (modoCheck ? "ativado" : "desativado"));
}

function render() {
let lista = document.getElementById("listaProdutos");
lista.innerHTML = "";

let busca = document.getElementById("busca").value?.toLowerCase() || "";

let filtrados = produtos.filter(p =>
p.nome.toLowerCase().includes(busca)
);

if (filtroBaixo) {
filtrados = filtrados.filter(p => p.quantidade <= 5);
}

filtrados.forEach((p, i) => {

let div = document.createElement("div");
div.className = "produto";

if (p.quantidade <= 5) {
div.classList.add("baixo");
}

div.innerHTML = `
<div>
<strong>${p.nome}</strong><br>
Qtd: ${p.quantidade}<br>
Atualizado: ${p.data}
</div>

<div>
<button onclick="alterar(${i}, -1)">-</button>
<button onclick="alterar(${i}, 1)">+</button>
</div>
`;

lista.appendChild(div);
});

atualizarDashboard();
renderHistorico();
}

function atualizarDashboard() {
document.getElementById("totalProdutos").innerText = produtos.length;
document.getElementById("estoqueBaixo").innerText =
produtos.filter(p => p.quantidade <= 5).length;
}

function renderHistorico() {
let div = document.getElementById("historico");
div.innerHTML = "";

historico.slice(0, 30).forEach(h => {
div.innerHTML += `
<div class="historico-item">
${h.data} — ${h.produto}: ${h.antes} → ${h.depois}
</div>
`;
});
}

async function gerarPDF() {
const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

pdf.text("Relatório de Estoque da Clínica", 10, 10);
pdf.text("Gerado em: " + dataAgora(), 10, 20);

let y = 40;

produtos.forEach(p => {
pdf.text(`${p.nome} - ${p.quantidade} unidades`, 10, y);
y += 10;
});

pdf.save("estoque-clinica.pdf");
}

function exportarLista() {
let texto = produtos.map(p =>
`${p.nome} - ${p.quantidade}`
).join("\n");

navigator.clipboard.writeText(texto);
alert("Lista copiada!");
}

document.getElementById("busca").addEventListener("input", render);

render();
