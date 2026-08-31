const urlBase = 'https://api.themoviedb.org/3/search/multi';

const apiTMDB = { 

    async obterPrograma(termoBusca,configuracoes) {
         // Verifica se as configurações e a chave existem
        // if (!configuracoes || !configuracoes.chaveTMDB) {
        //     alert('A integração com o TMDB não está configurada corretamente.');
        //     return [];
        // }

        const apiKey = configuracoes.chaveTMDB;
        const urlProgramas = `${urlBase}?api_key=${apiKey}&query=${encodeURIComponent(termoBusca)}&language=pt-BR`;   

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
    }
};

export default apiTMDB;