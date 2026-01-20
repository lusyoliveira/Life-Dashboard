export function abrirModalAcao({
  titulo = "",
  conteudoHTML = "",
  textoConfirmar = "Confirmar",
  classeBotao = "btn-primary",
  onConfirmar
}) {
  const modalEl = document.getElementById("modalAcao");
  const tituloEl = document.getElementById("modalAcaoTitulo");
  const bodyEl = document.getElementById("modalAcaoBody");
  const btnConfirmar = document.getElementById("modalAcaoConfirmar");

  tituloEl.textContent = titulo;
  bodyEl.innerHTML = conteudoHTML;

  btnConfirmar.textContent = textoConfirmar;
  btnConfirmar.className = `btn ${classeBotao}`;

  const modal = new bootstrap.Modal(modalEl);

  // remove eventos antigos
  const novoBotao = btnConfirmar.cloneNode(true);
  btnConfirmar.parentNode.replaceChild(novoBotao, btnConfirmar);

  novoBotao.addEventListener("click", async () => {
    if (onConfirmar) {
      const resultado = await onConfirmar();
      if (resultado === false) return; // validação falhou
    }
    modal.hide();
  });

  modal.show();
}
