import {
  Chart,
  BarController,
  DoughnutController,
  PieController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
} from "chart.js";


import { CORES_GRAFICOS } from "./coresGraficos.js";

// Registro obrigatório
Chart.register(
  BarController,
  DoughnutController,
  PieController,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

function obterCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) {
    console.warn(`Canvas '${id}' não encontrado`);
    return null;
  }
  return canvas;
}

export function criarGrafico({
  canvasId,
  tipo = "bar",
  labels = [],
  dados = [],
  titulo = "",
  exibirLegenda = false
}) {
  const canvas = obterCanvas(canvasId);
  if (!canvas) return;

  return new Chart(canvas, {
    type: tipo,
    data: {
      labels,
      datasets: [{
        label: titulo,
        data: dados,
        backgroundColor: CORES_GRAFICOS.slice(0, dados.length),
        borderRadius: tipo === "bar" ? 8 : 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: !!titulo,
          text: titulo
        },
        legend: {
          display: exibirLegenda,
          position: "bottom"
        }
      }
    }
  });
}
