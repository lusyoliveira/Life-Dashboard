import { criarGrafico } from "./graficos.js";

export function graficoBarra(canvasId, dados, titulo) {
  return criarGrafico({
    canvasId,
    tipo: "bar",
    labels: dados.labels,
    dados: dados.data,
    titulo,
    exibirLegenda: false
  });
}

export function graficoPizza(canvasId, dados, titulo) {
  return criarGrafico({
    canvasId,
    tipo: "pie",
    labels: dados.labels,
    dados: dados.data,
    titulo,
    exibirLegenda: true
  });
}

export function graficoRosca(canvasId, dados, titulo) {
  return criarGrafico({
    canvasId,
    tipo: "doughnut",
    labels: dados.labels,
    dados: dados.data,
    titulo,
    exibirLegenda: true
  });
}
