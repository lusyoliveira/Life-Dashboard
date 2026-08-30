// const urlBaseCidade = 'https://geocoding-api.open-meteo.com/v1/search';
 
// async function obtercidade() {
//   const parametroCidade = {
//             name: 'Juiz de Fora',
//             count: 1,
//             language: "pt",
//             format: "json",
//             countryCode: "BR"
//         };

//         const queryCidade = new URLSearchParams(parametroCidade).toString();
//         const urlCidade = `${urlBaseCidade}?${queryCidade}`;

//         try {
//             const response = await fetch(urlCidade)
//             return await response.json()
            
//         } catch (error) {
//             alert('Erro ao buscar cidade na API!')
//             throw error
//         }
// }
// const resultado = await obtercidade();
// console.log(resultado);
// //git rm --cached -r nome_da_pasta

const apiKey = ''; // Substitua pelo seu TMDB API Key
const urlBase = 'https://api.themoviedb.org/3/search/multi';

   async function obterPrograma() {
        const termoBusca = 'Charmed';
        const urlProgramas = `${urlBase}?api_key=${apiKey}&query=${encodeURIComponent(termoBusca)}&language=pt-BR`;   

        try {
            const response = await fetch(urlProgramas);
            if (!response.ok) throw new Error('Falha na resposta da API');
            
            if (response) {
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

                        console.log('Item processado:', {
                            id: `${item.media_type}-${item.id}`,
                            title: item.title || item.name, 
                            type: typeLabel,
                            synopsis: item.overview,
                            // Substituição com o domínio correto identificado por você
                            // FORMATO OFICIAL DO TMDB PARA APPS EXTERNOS
                            image: item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : null,
                            releaseYear: (item.release_date || item.first_air_date) ? 
                                new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
                            score: item.vote_average ? item.vote_average.toFixed(1) : 'N/A'
                        });

                        // return {
                        //     id: `${item.media_type}-${item.id}`,
                        //     title: item.title || item.name,
                        //     originalTitle: item.original_title || item.original_name,
                        //     type: typeLabel,
                        //     synopsis: item.overview,
                        //     // Substituição com o domínio correto identificado por você
                        //     // FORMATO OFICIAL DO TMDB PARA APPS EXTERNOS
                        //     image: item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : null,
                        //     releaseYear: (item.release_date || item.first_air_date) ? 
                        //         new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
                        //     score: item.vote_average ? item.vote_average.toFixed(1) : 'N/A'
                        // };
                    });
            }

        } catch (error) {
            console.error('Erro ao conectar com a API do TMDB:', error.message);    
            throw error;
        }
    }

obterPrograma();

// retorno
//  {
//       adult: false,
//       backdrop_path: '/ueZFcwAUvkjyAB9beaiqJyg0M8H.jpg',
//       id: 1981,
//       name: 'Charmed: Jovens Bruxas',
//       original_name: 'Charmed',
//       overview: 'Um grupo de irmãs descobre que são bruxas. Felizmente, para o mundo, eles são boas. Unindo-se em sua antiga casa em São Francisco, eles trabalham juntos para combater o mal, cada uma possuindo um poder especial específico.',
//       poster_path: '/lVpoG2ILzS4njYNx3Wiv50rHAnt.jpg',
//       media_type: 'tv',
//       original_language: 'en',
//       genre_ids: [Array],
//       popularity: 87.7136,
//       first_air_date: '1998-10-07',
//       softcore: false,
//       vote_average: 8.2,
//       vote_count: 2567,
//       origin_country: [Array]
//     },



// /**
//  * Rota de busca unificada: /api/search?query=nome_da_midia
//  */
// app.get('/api/search', async (req, res) => {
//     const { query } = req.query;

//     if (!query) {
//         return res.status(400).json({ error: 'O parâmetro "query" é obrigatório.' });
//     }

//     // Bloqueia a busca se você esquecer de colocar o token no arquivo .env
//     if (!TMDB_BEARER_TOKEN || TMDB_BEARER_TOKEN === 'seu_token_aqui') {
//         console.error('[Erro] Chave TMDB_BEARER_TOKEN não encontrada no arquivo .env');
//         return res.status(500).json({ error: 'Configure o token de acesso do TMDB no arquivo .env do servidor.' });
//     }

//     try {
//         // Faz a busca multi-mídia oficial do TMDB (traz filmes, séries e animes)
//         const response = await axios.get("https://api.themoviedb.org/3/search/multi", {
//             params: {
//                 query: query,
//                 language: 'pt-BR'
//             },
//             headers: { 
//                 Authorization: "Bearer " + TMDB_BEARER_TOKEN 
//             }
//         });

//         let unifiedResults = [];

//         // Filtra e padroniza as respostas vindas do TMDB
//         if (response.data && response.data.results) {
//             unifiedResults = response.data.results
//                 .filter(item => item.media_type === 'movie' || item.media_type === 'tv') // Descarta registros de pessoas/atores
//                 .map(item => {
//                     // Detecção automática de animes dentro do catálogo de TV do TMDB
//                     let typeLabel = item.media_type === 'movie' ? 'Filme' : 'Série';
                    
//                     // Se houver a palavra "Animation" ou "Anime" nos gêneros originários ou se for produzido no Japão, podemos categorizar como Anime
//                     const isJapaneseAnimation = item.origin_country && item.origin_country.includes('JP');
//                     if (item.media_type === 'tv' && isJapaneseAnimation) {
//                         typeLabel = 'Anime';
//                     }

//                     return {
//                         id: `${item.media_type}-${item.id}`,
//                         title: item.title || item.name,
//                         originalTitle: item.original_title || item.original_name,
//                         type: typeLabel,
//                         synopsis: item.overview,
//                         // Substituição com o domínio correto identificado por você
//                         // FORMATO OFICIAL DO TMDB PARA APPS EXTERNOS
//                         image: item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : null,
//                         releaseYear: (item.release_date || item.first_air_date) ? 
//                             new Date(item.release_date || item.first_air_date).getFullYear() : 'N/A',
//                         score: item.vote_average ? item.vote_average.toFixed(1) : 'N/A'
//                     };
//                 });
//         }

//         // Retorna o resultado limpo e unificado para o front-end
//         res.json({
//             query: query,
//             totalResults: unifiedResults.length,
//             results: unifiedResults
//         });

//     } catch (error) {
//         console.error('Erro ao conectar com a API do TMDB:', error.message);
//         res.status(500).json({ error: 'Erro ao processar busca no catálogo do TMDB.' });
//     }
// });