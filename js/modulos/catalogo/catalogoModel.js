export default class Catalogo {
    id
    Titulo
    Capa
    Tipo
    Status
    Plataforma
    Inicio
    Fim
    Episodios
    Assistidos
    Temporadas
    Score
    Vezes
    Adicao
    IdTMDB
    Original_Name
    Overview    
    Poster_Path
    Media_Type
    Genres_Ids
    Popularity
    First_Air_Date
    Year
    Vote_Average

     constructor(id, Titulo, Capa, Tipo, Status, Plataforma, Inicio, Fim, Episodios, Assistidos, Temporadas, Score = 0, Vezes = 0, Adicao = new Date(), IdTMDB, Original_Name, Overview , Poster_Path, Media_Type, Genres_Ids, Popularity, First_Air_Date, Year, Vote_Average) {
        this.id = id
        this.Titulo = Titulo
        this.Capa = Capa
        this.Tipo = Tipo
        this.Status = Status
        this.Plataforma = Plataforma
        this.Inicio = Inicio ? new Date(Inicio) : null
        this.Fim = Fim ? new Date(Fim) : null
        this.Episodios = Episodios
        this.Assistidos = Assistidos
        this.Temporadas = Temporadas
        this.Score = Score ?? 0
        this.Vezes = Vezes ?? 0
        this.Adicao = Adicao ? new Date(Adicao) : new Date()
        this.IdTMDB = IdTMDB
        this.Original_Name = Original_Name
        this.Overview = Overview
        this.Poster_Path = Poster_Path
        this.Media_Type = Media_Type
        this.Genres_Ids = Genres_Ids
        this.Popularity = Popularity
        this.First_Air_Date = First_Air_Date
        this.Year = Year
        this.Vote_Average = Vote_Average
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