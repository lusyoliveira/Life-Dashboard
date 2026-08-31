export class ConfiguracaoView {
    constructor(vm) {
        this.vm = vm;
    }

        formatarDataParaInput(data) {

        if (!data) {
            return '';
        }

        const dataConvertida = new Date(data);

        if (Number.isNaN(dataConvertida.getTime())) {
            console.warn('Data inválida:', data);
            return '';
        }

        return dataConvertida.toISOString().slice(0, 16);
    };

        async carregarConfiguracoes() {
        const configuracoes = (await this.vm.obterConfiguracoes())[0];

        // Contagem
        document.getElementById('data-contagem').value =
            new Date(configuracoes.dataContagem).toISOString().slice(0, 16);

        document.getElementById('descricao-contagem').value =
            configuracoes.descricaoContagem ?? "";

        // MyAnimeList
        document.getElementById('habilitar-mal').checked =
            configuracoes.ativaMAL;

        // Google
        document.getElementById('habilitar-google').checked =
            configuracoes.AtivaGoogle;

        document.getElementById('credencial-google').value =
            configuracoes.chaveGoogle ?? "";

        // Outlook
        document.getElementById('habilitar-outlook').checked =
            configuracoes.ativaOutlook;

        document.getElementById('credencial-outlook').value =
            configuracoes.chaveOutlook ?? "";

        // Clima
        document.getElementById('habilitar-clima').checked =
            configuracoes.ativaClima;

        document.getElementById('cidade').value =
            configuracoes.cidade ?? "";

        document.getElementById('latitude').value =
            configuracoes.latitude ?? "";

        document.getElementById('longitude').value =
            configuracoes.longitude ?? "";

        document.getElementById('atualiza-clima').value =
            configuracoes.atualizaClima ?? "";

        // TMDB
        document.getElementById('habilitar-tmdb').checked =
            configuracoes.ativaTMDB;
        document.getElementById('credencial-tmdb').value =
            configuracoes.chaveTMDB ?? "";
            
    };

    async configuracaoContagem(elementoId, configuracoes) {
        const elementoDestino = document.getElementById(elementoId) 

        if (elementoDestino) {
            const divDataContagem = document.createElement('div');
            divDataContagem.classList.add('col')

            const labelDataContagem = document.createElement('label');
            labelDataContagem.classList.add('form-label')
            labelDataContagem.setAttribute('for','data-contagem')
            labelDataContagem.textContent = 'Data:'

            const inputDataContagem = document.createElement('input');
            inputDataContagem.classList.add('form-control');
            inputDataContagem.setAttribute('type', 'datetime-local')
            inputDataContagem.setAttribute('id', 'data-contagem')
            inputDataContagem.setAttribute('placeholder', 'Informe a data')
            inputDataContagem.setAttribute('aria-label', 'Informe a data')  
            inputDataContagem.value = this.formatarDataParaInput(configuracoes.dataContagem);

            const divDescricaoContagem = document.createElement('div');
            divDescricaoContagem.classList.add('col')

            const labelDescricaoContagem = document.createElement('label');
            labelDescricaoContagem.classList.add('form-label')
            labelDescricaoContagem.setAttribute('for','descricao-contagem')
            labelDescricaoContagem.textContent = 'Descrição:'

            const inputDescricaoContagem = document.createElement('input');
            inputDescricaoContagem.classList.add('form-control');
            inputDescricaoContagem.setAttribute('type', 'text')
            inputDescricaoContagem.setAttribute('id', 'descricao-contagem')
            inputDescricaoContagem.setAttribute('placeholder', 'Informe a descrição')
            inputDescricaoContagem.setAttribute('aria-label', 'Informe a descrição')
            inputDescricaoContagem.value = configuracoes.descricaoContagem;

            divDescricaoContagem.appendChild(labelDataContagem);
            divDescricaoContagem.appendChild(inputDataContagem);
            divDataContagem.appendChild(labelDescricaoContagem);
            divDataContagem.appendChild(inputDescricaoContagem);
            elementoDestino.appendChild(divDataContagem);
            elementoDestino.appendChild(divDescricaoContagem);            
        }        
    };

    async configuracaoMAL(elementoId, configuracoes) {
        const elementoDestino = document.getElementById(elementoId)

        if (elementoDestino) {
            const divMAL = document.createElement('div');
            divMAL.classList.add('form-control')

            const tituloMAL = document.createElement('h4')
            tituloMAL.classList.add('pb-2')
            tituloMAL.textContent = 'MyAnimeList'

            const divSwitch = document.createElement('div');
            divSwitch.classList.add('form-check', 'form-switch')

            const labelSwitch = document.createElement('label');
            labelSwitch.classList.add('form-label')
            labelSwitch.setAttribute('for','habilitar-mal')
            labelSwitch.textContent = 'Habilita MyAnimeList'

            const inputSwitch = document.createElement('input');
                if (configuracoes.ativaMAL) {                
                    inputSwitch.setAttribute('checked', 'checked')
                    } 
            inputSwitch.classList.add('form-check-input')
            inputSwitch.setAttribute('type', 'checkbox')
            inputSwitch.setAttribute('role', 'switch')
            inputSwitch.setAttribute('id', 'habilitar-mal')
            inputSwitch.onclick = () => {
                if (configuracoes.ativaMAL) {                
                    inputSwitch.removeAttribute('checked', 'checked')
                } else {               
                    inputSwitch.setAttribute('checked', 'checked') 
                }
            }

            const divCredencial = document.createElement('div');
            divCredencial.classList.add('form-text')

            const labelCredencial = document.createElement('label');
            labelCredencial.classList.add('form-label')
            labelCredencial.setAttribute('for','credencial-mal')
            labelCredencial.textContent = 'Informe as credenciais:'

            const inputCredencial = document.createElement('input');
            inputCredencial.classList.add('form-control')
            inputCredencial.setAttribute('type', 'text')
            inputCredencial.setAttribute('placeholder', 'Informe o client-ID')
            inputCredencial.setAttribute('aria-label', 'Informe o client-ID')
            inputCredencial.setAttribute('id', 'credencial-mal')

            divSwitch.appendChild(labelSwitch)
            divSwitch.appendChild(inputSwitch)
            divCredencial.appendChild(labelCredencial)
            divCredencial.appendChild(inputCredencial)
            divMAL.appendChild(tituloMAL)
            divMAL.appendChild(divSwitch)
            divMAL.appendChild(divCredencial)
            elementoDestino.appendChild(divMAL)
        }
    };
    async configuracaoGoogle(elementoId, configuracoes) {
        const elementoDestino = document.getElementById(elementoId)

        if (elementoDestino) {
            const divGoogle = document.createElement('div');
            divGoogle.classList.add('form-control')

            const tituloGoogle = document.createElement('h4')
            tituloGoogle.classList.add('pb-2')
            tituloGoogle.textContent = 'Google Agenda'

            const divSwitch = document.createElement('div');
            divSwitch.classList.add('form-check', 'form-switch')

            const labelSwitch = document.createElement('label');
            labelSwitch.classList.add('form-label')
            labelSwitch.setAttribute('for','habilitar-google')
            labelSwitch.textContent = 'Habilita Google'

            const inputSwitch = document.createElement('input');
                if (configuracoes.ativaGoogle) {                
                        inputSwitch.setAttribute('checked', 'checked')
                        } 
            inputSwitch.classList.add('form-check-input')
            inputSwitch.setAttribute('type', 'checkbox')
            inputSwitch.setAttribute('role', 'switch')
            inputSwitch.setAttribute('id', 'habilitar-google')
            inputSwitch.onclick = () => {
                if (configuracoes.ativaGoogle) {                
                    inputSwitch.removeAttribute('checked', 'checked')
                } else {               
                    inputSwitch.setAttribute('checked', 'checked') 
                }
            }

            const divCredencial = document.createElement('div');
            divCredencial.classList.add('form-text')

            const labelCredencial = document.createElement('label');
            labelCredencial.classList.add('form-label')
            labelCredencial.setAttribute('for','credencial-google')
            labelCredencial.textContent = 'Informe as credenciais:'

            const inputCredencial = document.createElement('input');
            inputCredencial.classList.add('form-control')
            inputCredencial.setAttribute('type', 'text')
            inputCredencial.setAttribute('placeholder', 'Informe o client-ID')
            inputCredencial.setAttribute('aria-label', 'Informe o client-ID')
            inputCredencial.setAttribute('id', 'credencial-google')

            divSwitch.appendChild(labelSwitch)
            divSwitch.appendChild(inputSwitch)
            divCredencial.appendChild(labelCredencial)
            divCredencial.appendChild(inputCredencial)
            divGoogle.appendChild(tituloGoogle)
            divGoogle.appendChild(divSwitch)
            divGoogle.appendChild(divCredencial)
            elementoDestino.appendChild(divGoogle)
        }
    };

    async configuracaoOutlook(elementoId, configuracoes) {
        const elementoDestino = document.getElementById(elementoId)

        if (elementoDestino) {
            const divOutlook = document.createElement('div');
            divOutlook.classList.add('form-control')

            const titulOutlook = document.createElement('h4')
            titulOutlook.classList.add('pb-2')
            titulOutlook.textContent = 'Outlook'

            const divSwitch = document.createElement('div');
            divSwitch.classList.add('form-check', 'form-switch')

            const labelSwitch = document.createElement('label');
            labelSwitch.classList.add('form-label')
            labelSwitch.setAttribute('for','habilitar-outlook')
            labelSwitch.textContent = 'Habilita Outlook'

            const inputSwitch = document.createElement('input');
                if (configuracoes.ativaOutlook) {                
                    inputSwitch.setAttribute('checked', 'checked')
                    } 
            inputSwitch.classList.add('form-check-input')
            inputSwitch.setAttribute('type', 'checkbox')
            inputSwitch.setAttribute('role', 'switch')
            inputSwitch.setAttribute('id', 'habilitar-outlook')
            inputSwitch.onclick = () => {
                if (configuracoes.ativaOutlook) {                
                    inputSwitch.removeAttribute('checked', 'checked')
                } else {               
                    inputSwitch.setAttribute('checked', 'checked') 
                }
            }

            const divCredencial = document.createElement('div');
            divCredencial.classList.add('form-text')

            const labelCredencial = document.createElement('label');
            labelCredencial.classList.add('form-label')
            labelCredencial.setAttribute('for','credencial-outlook')
            labelCredencial.textContent = 'Informe as credenciais:'

            const inputCredencial = document.createElement('input');
            inputCredencial.classList.add('form-control')
            inputCredencial.setAttribute('type', 'text')
            inputCredencial.setAttribute('placeholder', 'Informe o client-ID')
            inputCredencial.setAttribute('aria-label', 'Informe o client-ID')
            inputCredencial.setAttribute('id', 'credencial-outlook')

            divSwitch.appendChild(labelSwitch)
            divSwitch.appendChild(inputSwitch)
            divCredencial.appendChild(labelCredencial)
            divCredencial.appendChild(inputCredencial)
            divOutlook.appendChild(titulOutlook)
            divOutlook.appendChild(divSwitch)
            divOutlook.appendChild(divCredencial)
            elementoDestino.appendChild(divOutlook)
        }
    };

    async  configuracaoClima(elementoId, configuracoes) {
        const elementoDestino = document.getElementById(elementoId)   

        if (elementoDestino) {
            const divClima = document.createElement('div');
            divClima.classList.add('form-control')

            const titulClima = document.createElement('h4')
            titulClima.classList.add('pb-2')
            titulClima.textContent = 'Clima'

            const divSwitch = document.createElement('div');
            divSwitch.classList.add('form-check', 'form-switch')

            const labelSwitch = document.createElement('label');
            labelSwitch.classList.add('form-label')
            labelSwitch.setAttribute('for','habilitar-clima')
            labelSwitch.textContent = 'Habilita Clima'

            const inputSwitch = document.createElement('input');
                if (configuracoes.ativaClima) {                
                inputSwitch.setAttribute('checked', 'checked')
                } 
            inputSwitch.classList.add('form-check-input')
            inputSwitch.setAttribute('type', 'checkbox')
            inputSwitch.setAttribute('role', 'switch')
            inputSwitch.setAttribute('id', 'habilitar-clima')
            inputSwitch.onclick = () => {
                if (configuracoes.ativaClima) {                
                    inputSwitch.removeAttribute('checked', 'checked')
                } else {               
                    inputSwitch.setAttribute('checked', 'checked') 
                }
            }

            const divCidade = document.createElement('div');
            divCidade.classList.add('col', 'd-flex', 'justify-content-between', 'align-items-center')

            const inputCidade = document.createElement('input');
            inputCidade.classList.add('form-control')
            inputCidade.setAttribute('type', 'text')
            inputCidade.setAttribute('placeholder', 'Informe a cidade')
            inputCidade.setAttribute('aria-label', 'Informe a cidade')
            inputCidade.setAttribute('id', 'cidade')
            inputCidade.value = configuracoes.cidade

            const btnBuscar = document.createElement('button')
            btnBuscar.classList.add('btn', 'btn-primary', 'm-2')
            btnBuscar.setAttribute('type','submit')
            btnBuscar.setAttribute('id','btn-buscar-cidade')
            btnBuscar.setAttribute('title','Buscar Cidade')
            btnBuscar.textContent = 'Buscar'

            const divLocalizacao = document.createElement('div');
            divLocalizacao.classList.add('form-text')

            const labelLatitude = document.createElement('label');
            labelLatitude.classList.add('form-label')
            labelLatitude.setAttribute('for','latitude')
            labelLatitude.textContent = 'Latitude'

            const inputLatitude = document.createElement('input');
            inputLatitude.classList.add('form-control')
            inputLatitude.setAttribute('type', 'text')
            inputLatitude.setAttribute('placeholder', 'Informe a latitude')
            inputLatitude.setAttribute('aria-label', 'Informe a latitude')
            inputLatitude.setAttribute('id', 'latitude')
            inputLatitude.value = configuracoes.latitude

            const labelLongitude = document.createElement('label');
            labelLongitude.classList.add('form-label')
            labelLongitude.setAttribute('for','longitude')
            labelLongitude.textContent = 'Longitude'

            const inputLongitude = document.createElement('input');
            inputLongitude.classList.add('form-control')
            inputLongitude.setAttribute('type', 'text')
            inputLongitude.setAttribute('placeholder', 'Informe a longitude')
            inputLongitude.setAttribute('aria-label', 'Informe a longitude')
            inputLongitude.setAttribute('id', 'longitude')
            inputLongitude.value = configuracoes.longitude

            const labelAtualizacao = document.createElement('label');
            labelAtualizacao.classList.add('form-label')
            labelAtualizacao.setAttribute('for','atualiza-clima')
            labelAtualizacao.textContent = 'Tempo de Atualização (minutos)'

            const inputAtualizacao = document.createElement('input');
            inputAtualizacao.classList.add('form-control')
            inputAtualizacao.setAttribute('type', 'number') 
            inputAtualizacao.setAttribute('id', 'atualiza-clima')
            inputAtualizacao.value = configuracoes.atualizaClima

            divLocalizacao.appendChild(labelAtualizacao)
            divLocalizacao.appendChild(inputAtualizacao)
            divLocalizacao.appendChild(labelLatitude)
            divLocalizacao.appendChild(inputLatitude)
            divLocalizacao.appendChild(labelLongitude)
            divLocalizacao.appendChild(inputLongitude)
            divSwitch.appendChild(labelSwitch)
            divSwitch.appendChild(inputSwitch)
            divCidade.appendChild(inputCidade)
            divCidade.appendChild(btnBuscar)
            divClima.appendChild(titulClima)
            divClima.appendChild(divSwitch)
            divClima.appendChild(divCidade)
            divClima.appendChild(divLocalizacao)
            elementoDestino.appendChild(divClima)
        }
    }
    async configuracaoTMDB(elementoId, configuracoes) {
        const elementoDestino = document.getElementById(elementoId)

        if (elementoDestino) {
            const divTMDB = document.createElement('div');
            divTMDB.classList.add('form-control')

            const tituloTMDB = document.createElement('h4')
            tituloTMDB.classList.add('pb-2')
            tituloTMDB.textContent = 'The Movie Database'

            const divSwitch = document.createElement('div');
            divSwitch.classList.add('form-check', 'form-switch')

            const labelSwitch = document.createElement('label');
            labelSwitch.classList.add('form-label')
            labelSwitch.setAttribute('for','habilitar-tmdb')
            labelSwitch.textContent = 'Habilita The Movie Database'

            const inputSwitch = document.createElement('input');
                if (configuracoes.ativaTMDB) {                
                    inputSwitch.setAttribute('checked', 'checked')
                    } 
            inputSwitch.classList.add('form-check-input')
            inputSwitch.setAttribute('type', 'checkbox')
            inputSwitch.setAttribute('role', 'switch')
            inputSwitch.setAttribute('id', 'habilitar-tmdb')
            inputSwitch.onclick = () => {
                if (configuracoes.ativaTMDB) {                
                    inputSwitch.removeAttribute('checked', 'checked')
                } else {               
                    inputSwitch.setAttribute('checked', 'checked') 
                }
            }

            const divCredencial = document.createElement('div');
            divCredencial.classList.add('form-text')

            const labelCredencial = document.createElement('label');
            labelCredencial.classList.add('form-label')
            labelCredencial.setAttribute('for','credencial-tmdb')
            labelCredencial.textContent = 'Informe as credenciais:'

            const inputCredencial = document.createElement('input');
            inputCredencial.classList.add('form-control')
            inputCredencial.setAttribute('type', 'text')
            inputCredencial.setAttribute('placeholder', 'Informe o client-ID')
            inputCredencial.setAttribute('aria-label', 'Informe o client-ID')
            inputCredencial.setAttribute('id', 'credencial-tmdb')
            inputCredencial.value = configuracoes.chaveTMDB

            divSwitch.appendChild(labelSwitch)
            divSwitch.appendChild(inputSwitch)
            divCredencial.appendChild(labelCredencial)
            divCredencial.appendChild(inputCredencial)
            divTMDB.appendChild(tituloTMDB)
            divTMDB.appendChild(divSwitch)
            divTMDB.appendChild(divCredencial)
            elementoDestino.appendChild(divTMDB)
        }
    };
}