export default class Catalogo {
    id
    Titulo
    Capa
    Tipo
    Status
    Onde
    Inicio
    Fim
    Episodios
    Assistidos
    Temporadas
    Score
    Vezes
    Adicao

     constructor(_id, Titulo, Capa, Tipo, Status, Onde, Inicio, Fim, Episodios, Assistidos, Temporadas, Score = 0, Vezes = 0, Adicao = new Date()) {
        this.id = _id
        this.Titulo = Titulo
        this.Capa = Capa
        this.Tipo = Tipo
        this.Status = Status
        this.Onde = Onde
        this.Inicio = Inicio ? new Date(Inicio) : null
        this.Fim = Fim ? new Date(Fim) : null
        this.Episodios = Episodios
        this.Assistidos = Assistidos
        this.Temporadas = Temporadas
        this.Score = Score ?? 0
        this.Vezes = Vezes ?? 0
        this.Adicao = Adicao ? new Date(Adicao) : new Date()
    }

    get Dias() {

        if (!this.Inicio || isNaN(this.Inicio)) {
            return 0;
        }

        const dataFimBruta = this.Fim && !isNaN(this.Fim)
            ? this.Fim
            : new Date();

        const inicio = new Date(
            this.Inicio.getFullYear(),
            this.Inicio.getMonth(),
            this.Inicio.getDate()
        );

        const fim = new Date(
            dataFimBruta.getFullYear(),
            dataFimBruta.getMonth(),
            dataFimBruta.getDate()
        );

        if (inicio.getTime() === fim.getTime()) {
            return 1;
        }

        const diffMs = fim - inicio;

        if (diffMs < 0) {
            return 0;
        }

        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    get Progresso () {
        if (!this.Assistidos || !this.Episodios || isNaN(this.Assistidos) || isNaN(this.Episodios)) {
            return 0;
        }
            return (this.Assistidos / this.Episodios) * 100; 
    }
}