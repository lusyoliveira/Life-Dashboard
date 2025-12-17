export default class Conta {
    Id
    Agencia
    Conta
    Banco
    Descricao
    Tipo
    Saldo

    constructor(_id,agencia,conta,banco,conta,descricao,tipo,saldo) {
        this.Id = _id
        this.Agencia = agencia
        this.Conta = conta
        this.Banco = banco
        this.Descricao = descricao
        this.Tipo = tipo
        this.Saldo = saldo
    }
}