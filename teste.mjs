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
