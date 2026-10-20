const utils = {
    criarData() {
      const diaSemana = new Date().toLocaleDateString('pt-br', { weekday : 'long' });
      const data = new Date().toLocaleDateString('pt-br');
      const hora = new Date().toLocaleTimeString('pt-br', { hour: 'numeric', minute: 'numeric' });
      const dataItem = `Adicionado em ${data} às ${hora}`
  
      return dataItem
    },

    // formatarParaISO(dataLocalString) {
    //     // Converte a string "yyyy-MM-ddThh:mm" para um objeto Date
    //     const data = new Date(dataLocalString);
    
    //     // Usa as partes da data local para construir a string final
    //     const ano = data.getFullYear();
    //     const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    //     const dia = data.getDate().toString().padStart(2, '0');
    //     const horas = data.getHours().toString().padStart(2, '0');
    //     const minutos = data.getMinutes().toString().padStart(2, '0');
    
    //     // Adiciona segundos e o 'Z' no final para simular o formato UTC
    //     return `${ano}-${mes}-${dia}T${horas}:${minutos}:00.000Z`;
    // }
    formatarParaISO(dataLocalString) {
        if (!dataLocalString) return null;

        let data;

        // Se a string veio no formato brasileiro (DD/MM/YYYY ou DD/MM/YYYY HH:mm)
        if (typeof dataLocalString === 'string' && dataLocalString.includes('/')) {
            const partes = dataLocalString.split(' ');
            const [dia, mes, ano] = partes[0].split('/');
            const horaMinuto = partes[1] || '00:00';
            
            // Remonta para um formato amigável para o construtor Date (YYYY-MM-DDTHH:mm)
            data = new Date(`${ano}-${mes}-${dia}T${horaMinuto}:00`);
        } else {
            // Caso contrário, tenta criar a data normalmente pelo construtor padrão
            data = new Date(dataLocalString);
        }

        // Valida se a data gerada é inválida
        if (isNaN(data.getTime())) return null;
    
        // Usa as partes da data local para construir a string final ISO
        const ano = data.getFullYear();
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const dia = data.getDate().toString().padStart(2, '0');
        const horas = data.getHours().toString().padStart(2, '0');
        const minutos = data.getMinutes().toString().padStart(2, '0');
    
        // Adiciona segundos e o 'Z' no final para simular o formato UTC
        return `${ano}-${mes}-${dia}T${horas}:${minutos}:00.000Z`;
    },

    formatarHorasParaHMS(totalHoras) {
        const totalSegundos = Math.floor(totalHoras * 3600);
    
        const horas = Math.floor(totalSegundos / 3600);
        const minutos = Math.floor((totalSegundos % 3600) / 60);
        const segundos = totalSegundos % 60;
    
        return [
        horas.toString().padStart(2, "0"),
        minutos.toString().padStart(2, "0"),
        segundos.toString().padStart(2, "0"),
        ].join(":");
    },

    converteDataUTC(dataString) {
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
    },
    
    formatarDataBR(valor) {
        if (!valor) return "";
    
        const data = new Date(valor);
        if (isNaN(data)) return "";
    
        return data.toLocaleDateString("pt-BR");
    },

    calculaTempoData(dataTexto) {
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
    },

    calcularProximaData(base, periodicidade) {
        const data = new Date(base);
    
        switch (periodicidade) {
            case 'Mensal':
                data.setMonth(data.getMonth() + 1);
                break;
    
            case 'Semanal':
                data.setDate(data.getDate() + 7);
                break;
    
            case 'Anual':
                data.setFullYear(data.getFullYear() + 1);
                break;
        }
    
        return data;
    },

    async carregarFormulario(caminho) {
        const res = await fetch(caminho);
        return await res.text();
    },

    limparFormulario(formId, camposExtras = []) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.reset();

        camposExtras.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.value = "";
        });
    },

    popularSelect(dados, elemento) {
        const selectElement = document.getElementById(elemento);

        selectElement.options.length = 0; // Limpa o select

        
        dados.forEach(dado => {
            let novaOpcao = new Option(
                dado.Descricao, 
                dado.id         ); 
            selectElement.add(novaOpcao);
        });
    },

    carregarPagina(pagina) {
        fetch(pagina)
            .then(response => response.text())
            .then(data => {
                document.getElementById("conteudo").innerHTML = data;
            })
            .catch(error => console.error("Erro ao carregar a página:", error));
    },

    abrirMenu() {
        document.getElementById("menuLateral").style.width = "250px";
    },

    fecharMenu() {
        document.getElementById("menuLateral").style.width = "0";
    },

    bufferParaBase64(poster) {
        if (!poster) return null;

        let bytes = null;

        if (
            typeof poster === 'object' &&
            poster.data &&
            Array.isArray(poster.data)
        ) {
            bytes = new Uint8Array(poster.data);
        } else if (poster instanceof Uint8Array) {
            bytes = poster;
        } else {
            return typeof poster === 'string'
                ? poster
                : null;
        }

        let binary = '';

        const tamanhoBloco = 8192;

        for (let i = 0; i < bytes.length; i += tamanhoBloco) {
            const bloco = bytes.subarray(
                i,
                Math.min(i + tamanhoBloco, bytes.length)
            );

            binary += String.fromCharCode(...bloco);
        }

        return btoa(binary);
    },

    renderMiniatura(poster) {
        // Inicia a variável vazia. A prioridade máxima agora é o poster local.
        let fonteImagemFinal = ""; 
        let stringPoster = "";
        const imagemConvertida = this.bufferParaBase64(poster);

        // Tenta extrair e decodificar o poster binário do banco primeiro
        if (imagemConvertida) {
            // Cenário A: Se o Sequelize devolveu um objeto contendo o array de dados do Buffer ({type: 'Buffer', data: [...]})
            if (typeof imagemConvertida === 'object' && imagemConvertida.data && Array.isArray(imagemConvertida.data)) {
                const bytes = new Uint8Array(imagemConvertida.data);
                let binary = '';
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                stringPoster = btoa(binary).trim();
            } 
            // Cenário B: Se ele veio como uma instância direta de Uint8Array
            else if (imagemConvertida instanceof Uint8Array || imagemConvertida.constructor?.name === "Uint8Array") {
                let binary = '';
                for (let i = 0; i < imagemConvertida.length; i++) {
                    binary += String.fromCharCode(imagemConvertida[i]);
                }
                stringPoster = btoa(binary).trim();
            }
            // Cenário C: Se já for uma string comum de texto (seja o Base64 cru ou uma string salva)
            else if (typeof imagemConvertida === 'string') {
                stringPoster = imagemConvertida.trim();
            }
        }
        
        // Se conseguimos uma string válida do poster e ela NÃO é o erro "[object Object]"
        if (stringPoster && stringPoster !== "" && !stringPoster.includes("[object")) {
            if (stringPoster.startsWith("data:image") || stringPoster.startsWith("http")) {
                fonteImagemFinal = stringPoster;
            } else {
                // Se for o texto Base64 cru gerado do banco, adiciona o prefixo indispensável para renderizar localmente
                fonteImagemFinal = "data:image/jpeg;base64," + stringPoster;
            }
        }

        return fonteImagemFinal;
    }
}

export default utils;