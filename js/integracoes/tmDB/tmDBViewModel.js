// 1. Correção da URL Base (adicionado "api." e "/3")
const urlBase = 'https://themoviedb.org';
const apiKey = '0aaa803a420e018f17e42c8cd390974a'; 

export class TMDBViewModel {  
    constructor() { 
        this.endpoint = 'tv';
        this.programas = [];
    }   

    async consultaProgramas() {
        try {
            // Presumindo que 'api' seja uma classe/utilitário externo seu
            this.programas = await api.buscarDados(this.endpoint);
            return this.programas;
        } catch (error) {
            alert('Erro ao consultar programas no banco!');
            throw error;
        }                       
    }   

    async obterPrograma(termoBusca) {
        const urlProgramas = `${urlBase}/search/${this.endpoint}?api_key=${apiKey}&query=${encodeURIComponent(termoBusca)}&include_adult=false&language=pt-BR&page=1`;   
        
        try {
            const response = await fetch(urlProgramas);
            if (!response.ok) throw new Error('Falha na resposta da API');
            return await response.json();
        } catch (error) {
            alert('Erro ao buscar programas na API!');
            throw error;
        }
    }
}
