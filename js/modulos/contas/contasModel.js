export default class Contas {
    id
    Agencia
    Conta
    Banco
    Descricao
    Tipo
    Saldo

    constructor (_id, agencia, conta, banco, descricao, tipo, saldo = 0) {
        this.id = _id
        this.Agencia = agencia
        this.Conta = conta
        this.Banco = banco
        this.Descricao = descricao  
        this.Tipo = tipo
        this.Saldo = saldo ?? 0
    }
}