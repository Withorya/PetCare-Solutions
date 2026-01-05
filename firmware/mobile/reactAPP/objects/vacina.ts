
class Vacina {
    Id_Vacina: number
    Id_Pet: number
    Id_Usuario: number
    Nome: string
    DataVacina: string
    DataProxDose?: string

    constructor(Id_Vacina:number,Id_Pet: number, Id_Usuario: number, Nome: string, DataVacina: string, DataProxDose?: string) {
        this.Id_Vacina = Id_Vacina
        this.Id_Pet = Id_Pet
        this.Id_Usuario = Id_Usuario
        this.Nome = Nome
        this.DataVacina = DataVacina
        this.DataProxDose = DataProxDose
    }
}

export {Vacina} 