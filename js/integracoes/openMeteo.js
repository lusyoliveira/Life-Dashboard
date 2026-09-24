import { ConfiguracaoViewModel } from '../modulos/configuracoes/ConfiguracaoViewModel.js';

const urlBaseClima = 'https://api.open-meteo.com/v1/forecast';
const urlBaseCidade = 'https://geocoding-api.open-meteo.com/v1/search'

//Extração da configuração da API
const cfvm = new ConfiguracaoViewModel();
const dadosConfig = (await cfvm.obterConfiguracoes())[0];

const apiOpenMeteo = { 

    async obterClima() {
        const parametroClima = {
            latitude: dadosConfig.latitude,
            longitude: dadosConfig.longitude,
            daily: "weather_code,temperature_2m_max,temperature_2m_min",
            current: "weather_code,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,rain,showers,snowfall,cloud_cover,pressure_msl,surface_pressure",
            timeformat: "iso8601",
            forecast_days: 7
        };

        const queryClima = new URLSearchParams(parametroClima).toString();
        const urlClima = `${urlBaseClima}?${queryClima}`;

        try {
            const response = await fetch(urlClima)
            return await response.json()
        } catch (error) {
            alert('Erro ao buscar clima na API!')
            throw error
        }
    },

    async obterCidade() {
        const cidade = dadosConfig.Cidade;

        const parametroCidade = {
            name: cidade,
            count: 1,
            language: "pt",
            format: "json",
            countryCode: "BR"
        };

        const queryCidade = new URLSearchParams(parametroCidade).toString();
        const urlCidade = `${urlBaseCidade}?${queryCidade}`;

        try {
            const response = await fetch(urlCidade)
            return await response.json()
            
        } catch (error) {
            alert('Erro ao buscar cidade na API!')
            throw error
        }
    }
};

export default apiOpenMeteo;