import api from "../js/metodoApi.js";
import Clima from "../Clima/Clima.js"

const urlBaseClima = 'https://api.open-meteo.com/v1/forecast';
const urlBaseCidade = 'https://geocoding-api.open-meteo.com/v1/search'

export class ClimaViewModel {
    constructor(endpoint = 'clima') {
        this.endpoint = endpoint
        this.clima = []
    }

    async consultaClima() {
        try {            
            this.clima = await api.buscarDados(this.endpoint);
            return this.clima;
        } catch (error) {
            alert('Erro ao consulta clima no banco!')
            throw error
        }
    }

    async obterClima(configuracoesClima) {
        const parametroClima = {
            latitude: configuracoesClima.latitude,
            longitude: configuracoesClima.longitude,
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
    }

    async obterCidade(Cidade) {
        const parametroCidade = {
            name: Cidade,
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

    async atualizarClima(configuracoesClima) {
        try {
            const dadosCidade = await this.obterCidade(configuracoesClima.Cidade);
            if (!dadosCidade.results || dadosCidade.results.length === 0) {
                alert('Cidade não encontrada!');
                return;
            }

            const cidade = dadosCidade.results[0];
            const dadosClima = await this.obterClima({
                latitude: cidade.latitude,
                longitude: cidade.longitude
            });

            console.log(cidade);
            // cria uma instância da classe Clima
            const clima = new Clima(
                cidade._id,
                cidade.name,
                cidade.latitude,
                cidade.longitude,
                cidade.elevation,
                cidade.feature_code,
                cidade.country_code,
                cidade.admin1_id,
                cidade.admin2_id,
                cidade.timezone,
                cidade.population,
                cidade.country_id,
                cidade.country,
                cidade.admin1,
                cidade.admin2,
                dadosClima.current_units,
                dadosClima.current,
                dadosClima.daily_units,
                dadosClima.daily
            );
            
            console.log(clima);
            
            debugger
            if (clima.id) {
            // salva o clima completo
                await api.atualizarDados(clima, this.endpoint);
            }
            //alert('Clima salvo com sucesso!');            
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar os dados do clima!');
            throw error;
        }
    }
    
}
