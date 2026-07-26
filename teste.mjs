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

// const apiKey = ''; // Substitua pela sua chave do TMDB
// const termoBusca = 'Charmed: Jovens Bruxas';
// const url = `https://api.themoviedb.org{apiKey}&query=${encodeURIComponent(termoBusca)}&language=pt-BR`;
// const url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(termoBusca)}&language=pt-BR`;

// async function buscarFilme() {
//   try {
//     const resposta = await fetch(url);
//     const dados = await resposta.json();
//     console.log(dados.results); // Lista de filmes encontrados
//   } catch (erro) {
//     console.error('Erro na consulta:', erro);
//   }
// }

// buscarFilme();
