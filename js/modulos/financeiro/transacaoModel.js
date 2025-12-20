export default class Transacao {
    Id
    Descricao
    Data
    Categoria
    Conta
    Valor
    ParcelaInicio
    ParcelaFim
    Parcelamento

    constructor(id,descricao,data,categoria,conta,valor,parcelaInicio,parcelaFim, parcelamento = false) {
        this.Id = id
        this.Descricao = descricao
        this.Data = data
        this.Categoria = categoria
        this.Conta = conta
        this.Valor = valor
        this.ParcelaInicio = parcelaInicio
        this.ParcelaFim = parcelaFim
        this.Parcelamento = parcelamento
    }
}