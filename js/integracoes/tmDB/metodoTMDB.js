const urlBase = 'https://api.themoviedb.org/3/search';
//const urlBase = 'https://api.themoviedb.org/3/search/multi';

// // Extração da configuração da API
// const cfvm = new ConfiguracaoViewModel('configuracoes');
// const dadosConfig = (await cfvm.obterConfiguracoes())[0];

//if (dadosConfig.ativaTMDB) {
// const apiKey = dadosConfig?.chaveTMDB; 
//}

const apiTMDB = { 

    async obterPrograma(termoBusca,configuracoes) {
         // Verifica se as configurações e a chave existem
        // if (!configuracoes || !configuracoes.chaveTMDB) {
        //     alert('A integração com o TMDB não está configurada corretamente.');
        //     return [];
        // }

        const apiKey = configuracoes.chaveTMDB;
        const urlProgramas = `${urlBase}?{multi}?api_key=${apiKey}&query=${encodeURIComponent(termoBusca)}&language=pt-BR`;   

        try {
            const response = await fetch(urlProgramas);
            if (!response.ok) {
                throw new Error('Falha na resposta da API');
            } else {
              const data = await response.json();
              return data.results
                .filter(item => item.media_type === 'movie' || item.media_type === 'tv') 
                .map(item => {
                        // Detecção automática de animes dentro do catálogo de TV do TMDB
                        let typeLabel = item.media_type === 'movie' ? 'Filme' : 'Série';
                        
                        // Se houver a palavra "Animation" ou "Anime" nos gêneros originários ou se for produzido no Japão, podemos categorizar como Anime
                        const isJapaneseAnimation = item.origin_country && item.origin_country.includes('JP');
                        if (item.media_type === 'tv' && isJapaneseAnimation) {
                            typeLabel = 'Anime';
                        }

                        return {
                            id: `${item.media_type}-${item.id}`,
                            title: item.title || item.name,
                            originalTitle: item.original_title || item.original_name,
                            type: typeLabel,
                            synopsis: item.overview,
                            // Substituição com o domínio correto identificado por você
                            // FORMATO OFICIAL DO TMDB PARA APPS EXTERNOS
                            image: item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : null,
                            releaseYear: (item.release_date || item.first_air_date) ? 
                                new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
                            score: item.vote_average ? item.vote_average.toFixed(1) : 'N/A'
                        };
                    });
            }
        } catch (error) {
            alert('Erro ao buscar programas na API!');
            throw error;
        }
    },

    async obterDetalhesPrograma(id, configuracoes) {
        if (!configuracoes || !configuracoes.chaveTMDB) {
            alert('A integração com o TMDB não está configurada corretamente.');
            return null;
        }
        const apiKey = configuracoes.chaveTMDB;
        const [mediaType, mediaId] = id.split('-');
        const url = `${urlBase}${mediaType}/${mediaId}?api_key=${apiKey}&language=pt-BR`;    
    },

        async obterProgramaPorDescricao(titulo, tipo) {
        try {
            const apiKey = dadosConfig?.chaveTMDB;
            const deparTipo = (tipo === 'Filme' || tipo === '6' || tipo === 'movie') ? 'movie' : 'tv';           
            const url = `${urlBase}&${deparTipo}?api_key=${apiKey}&query=${encodeURIComponent(titulo)}&language=pt-BR`;

            const respostaBusca = await fetch(url);
            if (!respostaBusca.ok) throw new Error(`HTTP ${respostaBusca.status}`);
            
            const resultado = await respostaBusca.json();
            
            if (!resultado.results || resultado.results.length === 0) return null;
            const dadosTMDB = resultado.results[0];

            // Retorna as propriedades normais mapeadas para o seu construtor
            return {
                id_tmdb: dadosTMDB.id,
                title: dadosTMDB.title || dadosTMDB.name,
                Original_Name: dadosTMDB.original_title || dadosTMDB.original_name,
                Media_Type: deparTipo,
                Overview: dadosTMDB.overview,
                Poster_Path: dadosTMDB.poster_path ? "https://tmdb.org" + dadosTMDB.poster_path : null,
                Year: (dadosTMDB.release_date || dadosTMDB.first_air_date) ? 
                    new Date(dadosTMDB.release_date || dadosTMDB.first_air_date).getFullYear() : 'N/A',
                First_Air_Date: dadosTMDB.release_date || dadosTMDB.first_air_date || 'N/A',
                Vote_Average: dadosTMDB.vote_average ? dadosTMDB.vote_average : 0,
                Popularity: dadosTMDB.popularity || 0,
                Genres_Ids: dadosTMDB.genre_ids ? JSON.stringify(dadosTMDB.genre_ids) : '[]'
            };
        } catch (error) {
            console.error('Erro ao buscar programa por descrição na API:', error);
            throw error;
        }
    }

};

export default apiTMDB;