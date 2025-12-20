export function criarData() {
    const diaSemana = new Date().toLocaleDateString('pt-br', { weekday : 'long' });
    const data = new Date().toLocaleDateString('pt-br');
    const hora = new Date().toLocaleTimeString('pt-br', { hour: 'numeric', minute: 'numeric' });
    const dataItem = `Adicionado em ${data} às ${hora}`

    return dataItem
};

export function formatarParaISO(dataLocalString) {
  // Converte a string "yyyy-MM-ddThh:mm" para um objeto Date
  const data = new Date(dataLocalString);

  // Usa as partes da data local para construir a string final
  const ano = data.getFullYear();
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const dia = data.getDate().toString().padStart(2, '0');
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');

  // Adiciona segundos e o 'Z' no final para simular o formato UTC
  return `${ano}-${mes}-${dia}T${horas}:${minutos}:00.000Z`;
}


export function converteDataUTC(dataString) {
    // const [ano, mes, dia] = dataString.split('-')

    // return new Date(Date.UTC(ano, mes - 1, dia))
    const [data, hora] = dataString.split('T');
    const [ano, mes, dia] = data.split('-');
    
    let horaStr = '00';
    let minutoStr = '00';

    if (hora) {
        [horaStr, minutoStr] = hora.split(':');
    }

    return new Date(Date.UTC(ano, mes - 1, dia, horaStr, minutoStr)).toISOString();
};

export function calculaTempoData(dataTexto) {
  let dataAlvo;

  if (!dataTexto) return "";

  if (dataTexto instanceof Date) {
    dataAlvo = dataTexto;
  } else if (typeof dataTexto === "string") {
    // Detecta se é formato ISO (YYYY-MM-DDTHH:mm:ssZ)
    if (dataTexto.includes("T")) {
      dataAlvo = new Date(dataTexto);
    } 
    // Detecta formato brasileiro (dd/MM/yyyy)
    else if (dataTexto.includes("/")) {
      const [dia, mes, ano] = dataTexto.split("/");
      dataAlvo = new Date(ano, mes - 1, dia);
    } 
    else {
      // Caso venha um formato inesperado
      return "";
    }
  } else {
    return "";
  }

  if (isNaN(dataAlvo.getTime())) return "";

  const agora = new Date();
  // Zera as horas para comparar apenas as datas
  dataAlvo.setHours(0, 0, 0, 0);
  agora.setHours(0, 0, 0, 0);

  const diffMs = dataAlvo - agora;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const passado = diffDias < 0;
  const dias = Math.abs(diffDias);

  const anos = Math.floor(dias / 365);
  const meses = Math.floor((dias % 365) / 30);

  let frase = "";

  if (dias === 0) {
    frase = "Hoje";
  } else if (dias === 1) {
    frase = passado ? "Ontem" : "Amanhã";
  } else if (anos >= 1) {
    frase = `${passado ? "Há" : "Em"} ${anos} ${anos === 1 ? "ano" : "anos"}`;
  } else if (meses >= 1) {
    frase = `${passado ? "Há" : "Em"} ${meses} ${meses === 1 ? "mês" : "meses"}`;
  } else {
    frase = `${passado ? "Há" : "Em"} ${dias} dias`;
  }

  return frase;
}

