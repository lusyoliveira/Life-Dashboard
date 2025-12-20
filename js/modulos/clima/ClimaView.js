export class ClimaView {
    constructor(vm) {
        this.vm = vm;
    }

    async exibirClima(elementoId) {
        const clima = (await this.vm.consultaClima())[0];
        const climaContainer = document.getElementById(elementoId)   
         if (!climaContainer) return;

        climaContainer.innerHTML = '';

        const divColunaHoje = document.createElement('div');
        divColunaHoje.classList.add('col')

        const divContainerHoje = document.createElement('div');
        divContainerHoje.classList.add('col-md', 'd-flex', 'justify-content-evenly')

        const spanHoje = document.createElement('span');
        spanHoje.classList.add('fs-3', 'm-4');
        spanHoje.textContent = clima.name;

        const iconeClima = document.createElement('i');
        iconeClima.classList.add('bi', 'bi-moon-stars-fill', 'fs-3', 'm-4');

        const divColunaTemperatura = document.createElement('div');
        divColunaTemperatura.classList.add('d-flex', 'flex-column');

        const spanTemperatura = document.createElement('span');
        spanTemperatura.classList.add('fs-3', 'm-2');
        spanTemperatura.textContent = `${clima.current.temperature_2m}°`;
        
        const spanSitucao = document.createElement('span');
        spanSitucao.classList.add('fs-5', 'm-1');
        spanSitucao.textContent = 'Céu claro';

        divContainerHoje.appendChild(spanHoje);
        divContainerHoje.appendChild(iconeClima); 
        divContainerHoje.appendChild(divColunaTemperatura);           
        divColunaTemperatura.appendChild(spanTemperatura);
        divColunaTemperatura.appendChild(spanSitucao);
        divColunaHoje.appendChild(divContainerHoje);
        climaContainer.appendChild(divColunaHoje);
        
        const divColunaPrevisao = document.createElement('div');
        divColunaPrevisao.classList.add('col', 'd-flex', 'justify-content-between');

        const divContainerDomingo = document.createElement('div');
        divContainerDomingo.classList.add('col-md-auto');

        const divDomingo = document.createElement('div');
        divDomingo.classList.add('col-8','col-sm-6', 'd-flex', 'flex-column', 'align-items-center');

        const spanDomingo = document.createElement('span');
        spanDomingo.classList.add('fs-5');
        spanDomingo.textContent = 'Domingo';

        const iconeDomingo = document.createElement('i');
        iconeDomingo.classList.add('bi', 'bi-moon-stars-fill');

        const spanTemperaturaMaximaDomingo = document.createElement('span');
        spanTemperaturaMaximaDomingo.classList.add('fs-7');
        spanTemperaturaMaximaDomingo.textContent = `${clima.daily.temperature_2m_max[0]}°`;

        const spanTemperaturaMinimaDomingo = document.createElement('span');
        spanTemperaturaMinimaDomingo.classList.add('fs-7');
        spanTemperaturaMinimaDomingo.textContent = `${clima.daily.temperature_2m_min[0]}°`;

        const divContainerSegunda = document.createElement('div');
        divContainerSegunda.classList.add('col-md-auto');

        const divSegunda = document.createElement('div');
        divSegunda.classList.add('col-8','col-sm-6', 'd-flex', 'flex-column', 'align-items-center');

        const spanSegunda = document.createElement('span');
        spanSegunda.classList.add('fs-5');
        spanSegunda.textContent = 'Segunda';

        const iconeSegunda = document.createElement('i');
        iconeSegunda.classList.add('bi', 'bi-moon-stars-fill');

        const spanTemperaturaMaximaSegunda = document.createElement('span');
        spanTemperaturaMaximaSegunda.classList.add('fs-7');
        spanTemperaturaMaximaSegunda.textContent = `${clima.daily.temperature_2m_max[1]}°`;

        const spanTemperaturaMinimaSegunda = document.createElement('span');
        spanTemperaturaMinimaSegunda.classList.add('fs-7');
        spanTemperaturaMinimaSegunda.textContent = `${clima.daily.temperature_2m_min[1]}°`;

        const divContainerTerca = document.createElement('div');
        divContainerTerca.classList.add('col-md-auto');

        const divTerca = document.createElement('div');
        divTerca.classList.add('col-8','col-sm-6', 'd-flex', 'flex-column', 'align-items-center');

        const spanTerca = document.createElement('span');
        spanTerca.classList.add('fs-5');
        spanTerca.textContent = 'Terca';

        const iconeTerca = document.createElement('i');
        iconeTerca.classList.add('bi', 'bi-moon-stars-fill');

        const spanTemperaturaMaximaTerca = document.createElement('span');
        spanTemperaturaMaximaTerca.classList.add('fs-7');
        spanTemperaturaMaximaTerca.textContent = `${clima.daily.temperature_2m_max[2]}°`;

        const spanTemperaturaMinimaTerca = document.createElement('span');
        spanTemperaturaMinimaTerca.classList.add('fs-7');
        spanTemperaturaMinimaTerca.textContent = `${clima.daily.temperature_2m_min[2]}°`;
        
        const divContainerQuarta = document.createElement('div');
        divContainerQuarta.classList.add('col-md-auto');

        const divQuarta = document.createElement('div');
        divQuarta.classList.add('col-8','col-sm-6', 'd-flex', 'flex-column', 'align-items-center');

        const spanQuarta = document.createElement('span');
        spanQuarta.classList.add('fs-5');
        spanQuarta.textContent = 'Quarta';

        const iconeQuarta = document.createElement('i');
        iconeQuarta.classList.add('bi', 'bi-moon-stars-fill');

        const spanTemperaturaMaximaQuarta = document.createElement('span');
        spanTemperaturaMaximaQuarta.classList.add('fs-7');
        spanTemperaturaMaximaQuarta.textContent = `${clima.daily.temperature_2m_max[3]}°`;

        const spanTemperaturaMinimaQuarta = document.createElement('span');
        spanTemperaturaMinimaQuarta.classList.add('fs-7');
        spanTemperaturaMinimaQuarta.textContent = `${clima.daily.temperature_2m_min[3]}°`;

        const divContainerQuinta = document.createElement('div');
        divContainerQuinta.classList.add('col-md-auto');

        const divQuinta = document.createElement('div');
        divQuinta.classList.add('col-8','col-sm-6', 'd-flex', 'flex-column', 'align-items-center');

        const spanQuinta = document.createElement('span');
        spanQuinta.classList.add('fs-5');
        spanQuinta.textContent = 'Quinta';

        const iconeQuinta = document.createElement('i');
        iconeQuinta.classList.add('bi', 'bi-moon-stars-fill');

        const spanTemperaturaMaximaQuinta = document.createElement('span');
        spanTemperaturaMaximaQuinta.classList.add('fs-7');
        spanTemperaturaMaximaQuinta.textContent = `${clima.daily.temperature_2m_max[4]}°`;

        const spanTemperaturaMinimaQuinta = document.createElement('span');
        spanTemperaturaMinimaQuinta.classList.add('fs-7');
        spanTemperaturaMinimaQuinta.textContent = `${clima.daily.temperature_2m_min[4]}°`;

        const divContainerSexta = document.createElement('div');
        divContainerSexta.classList.add('col-md-auto');

        const divSexta = document.createElement('div');
        divSexta.classList.add('col-8','col-sm-6', 'd-flex', 'flex-column', 'align-items-center');

        const spanSexta = document.createElement('span');
        spanSexta.classList.add('fs-5');
        spanSexta.textContent = 'Sexta';

        const iconeSexta = document.createElement('i');
        iconeSexta.classList.add('bi', 'bi-moon-stars-fill');

        const spanTemperaturaMaximaSexta = document.createElement('span');
        spanTemperaturaMaximaSexta.classList.add('fs-7');
        spanTemperaturaMaximaSexta.textContent = `${clima.daily.temperature_2m_max[5]}°`;

        const spanTemperaturaMinimaSexta = document.createElement('span');
        spanTemperaturaMinimaSexta.classList.add('fs-7');
        spanTemperaturaMinimaSexta.textContent = `${clima.daily.temperature_2m_min[5]}°`;

        const divContainerSabado = document.createElement('div');
        divContainerSabado.classList.add('col-md-auto');

        const divSabado = document.createElement('div');
        divSabado.classList.add('col-8','col-sm-6', 'd-flex', 'flex-column', 'align-items-center');

        const spanSabado = document.createElement('span');
        spanSabado.classList.add('fs-5');
        spanSabado.textContent = 'Sabado';

        const iconeSabado = document.createElement('i');
        iconeSabado.classList.add('bi', 'bi-moon-stars-fill');
        
        const spanTemperaturaMaximaSabado = document.createElement('span');
        spanTemperaturaMaximaSabado.classList.add('fs-7');
        spanTemperaturaMaximaSabado.textContent = `${clima.daily.temperature_2m_max[6]}°`;

        const spanTemperaturaMinimaSabado = document.createElement('span');
        spanTemperaturaMinimaSabado.classList.add('fs-7');
        spanTemperaturaMinimaSabado.textContent = `${clima.daily.temperature_2m_min[6]}°`;

        divContainerDomingo.appendChild(divDomingo);
        divDomingo.appendChild(spanDomingo);
        divDomingo.appendChild(iconeDomingo);
        divDomingo.appendChild(spanTemperaturaMaximaDomingo);
        divDomingo.appendChild(spanTemperaturaMinimaDomingo);
        divContainerSegunda.appendChild(divSegunda);
        divSegunda.appendChild(spanSegunda);
        divSegunda.appendChild(iconeSegunda);
        divSegunda.appendChild(spanTemperaturaMaximaSegunda);
        divSegunda.appendChild(spanTemperaturaMinimaSegunda);
        divContainerTerca.appendChild(divTerca);
        divTerca.appendChild(spanTerca);
        divTerca.appendChild(iconeTerca);
        divTerca.appendChild(spanTemperaturaMaximaTerca);
        divTerca.appendChild(spanTemperaturaMinimaTerca);
        divContainerQuarta.appendChild(divQuarta);
        divQuarta.appendChild(spanQuarta);
        divQuarta.appendChild(iconeQuarta);
        divQuarta.appendChild(spanTemperaturaMaximaQuarta);
        divQuarta.appendChild(spanTemperaturaMinimaQuarta);
        divContainerQuinta.appendChild(divQuinta);
        divQuinta.appendChild(spanQuinta);
        divQuinta.appendChild(iconeQuinta);
        divQuinta.appendChild(spanTemperaturaMaximaQuinta);
        divQuinta.appendChild(spanTemperaturaMinimaQuinta);
        divContainerSexta.appendChild(divSexta);
        divSexta.appendChild(spanSexta);
        divSexta.appendChild(iconeSexta);
        divSexta.appendChild(spanTemperaturaMaximaSexta);
        divSexta.appendChild(spanTemperaturaMinimaSexta);
        divContainerSabado.appendChild(divSabado);
        divSabado.appendChild(spanSabado);
        divSabado.appendChild(iconeSabado);
        divSabado.appendChild(spanTemperaturaMaximaSabado);
        divSabado.appendChild(spanTemperaturaMinimaSabado);        
        divColunaPrevisao.appendChild(divContainerDomingo);
        divColunaPrevisao.appendChild(divContainerSegunda);
        divColunaPrevisao.appendChild(divContainerTerca);
        divColunaPrevisao.appendChild(divContainerQuarta);
        divColunaPrevisao.appendChild(divContainerQuinta);
        divColunaPrevisao.appendChild(divContainerSexta);
        divColunaPrevisao.appendChild(divContainerSabado);
        climaContainer.appendChild(divColunaPrevisao);

    }
}