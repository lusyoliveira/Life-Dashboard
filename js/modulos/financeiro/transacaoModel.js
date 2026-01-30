export default class Transacao {
    Id
    Descricao
    Data
    Categoria
    ContaDestino
    ContaOrigem
    Valor
    ParcelaInicio
    ParcelaFim
    Parcelamento
    Tipo

    constructor(id,descricao,data,categoria,contaDestino,contaOrigem,valor,parcelaInicio,parcelaFim, parcelamento = false,tipo) {
        this.Id = id
        this.Descricao = descricao
        this.Data = data
        this.Categoria = categoria
        this.ContaDestino = contaDestino ? contaDestino : null
        this.ContaOrigem = contaOrigem
        this.Valor = valor
        this.ParcelaInicio = parcelaInicio ? parcelaInicio : null
        this.ParcelaFim = parcelaFim ? parcelaFim : null
        this.Parcelamento = parcelamento ? parcelamento : false
        this.Tipo = tipo

    }
}