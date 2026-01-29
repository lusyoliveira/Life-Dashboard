export default class Transacao {
    Id
    Descricao
    Data
    Categoria
    Conta
    ContaOrigem
    Valor
    ParcelaInicio
    ParcelaFim
    Parcelamento
    Tipo

    constructor(id,descricao,data,categoria,conta,contaOrigem,valor,parcelaInicio,parcelaFim, parcelamento = false,tipo) {
        this.Id = id
        this.Descricao = descricao
        this.Data = data
        this.Categoria = categoria
        this.Conta = conta
        this.ContaOrigem = contaOrigem ? contaOrigem : null
        this.Valor = valor
        this.ParcelaInicio = parcelaInicio ? parcelaInicio : null
        this.ParcelaFim = parcelaFim ? parcelaFim : null
        this.Parcelamento = parcelamento ? parcelamento : false
        this.Tipo = tipo

    }
}