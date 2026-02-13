export default class Transacao {
    Id
    Descricao
    Data
    Categoria
    ContaDestino
    ContaOrigem
    Valor
    ParcelaInicio
    Parcelamento
    Tipo
    Recorrente
    Periodicidade
    RecorrenciaInicio
    RecorrenciaFim
    UltimaGeracao

    constructor(id,descricao,data,categoria,contaDestino,contaOrigem,valor,parcelaInicio,parcelamento = false,tipo,recorrente, periodicidade, recorrenciaInicio, recorrenciaFim, ultimaGeracao) {
        this.Id = id
        this.Descricao = descricao
        this.Data = data
        this.Categoria = categoria
        this.ContaDestino = contaDestino ? contaDestino : null
        this.ContaOrigem = contaOrigem
        this.Valor = valor
        this.ParcelaInicio = parcelaInicio ? parcelaInicio : null
        this.Parcelamento = parcelamento ? parcelamento : false
        this.Tipo = tipo
        this.Recorrente = recorrente ? recorrente : false
        this.Periodicidade = periodicidade ? periodicidade : null
        this.RecorrenciaInicio = recorrenciaInicio ? recorrenciaInicio : null
        this.RecorrenciaFim = recorrenciaFim ? recorrenciaFim : null
        this.UltimaGeracao = ultimaGeracao ? ultimaGeracao : null
    }
}