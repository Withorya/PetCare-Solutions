import { compromisso } from "@/objects/compromisso"
import { Pet } from "@/objects/pet"
import { Usuario } from "@/objects/usuario"
import { Vacina } from "@/objects/vacina"
import { useSQLiteContext } from "expo-sqlite"

export function useDatabase(){
    const database = useSQLiteContext() 
    async function create(dados : Usuario|Pet|Vacina|compromisso) {
       
        if(dados instanceof Usuario){
            try {
                
                const statement = await database.prepareAsync(
                     `INSERT INTO usuarios (Id_Usuario, Nome, Senha, Email, Premium, Data_Nascimento, Foto, Tema, Idioma, Notificacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                 );
                var passar = {
                    id : Number(dados.Id_usuario),
                    nome : String(dados.nome),
                    foto : String(dados.fotoPerfil),
                    data : Number(dados.dataNascimento)
                }
                
                const result = await statement.executeAsync([
                    passar.id,
                    passar.nome,
                    dados.senha,
                    dados.email,
                    dados.premium,
                    passar.data,
                    passar.foto||"",
                    dados.tema,
                    dados.idioma,
                    dados.notificacoes
                ])
                const insertedRowId = result.lastInsertRowId.toLocaleString()
                
                statement.finalizeAsync()
                return { insertedRowId }
            } catch (error) {
                throw error
            }
        }
                
         if(dados instanceof Pet){
            try {
                
                
                const statemento = await database.prepareAsync(
                    `INSERT INTO pet (id_pet, Id_Usuario, foto, Nome, Especie, Data_nascimento, Raca, Peso, Cor, sexo, Porte, Descricao_saude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                var passou = {
                    idPet: Number(dados.id),
                    dataNascimento: dados.dataNasc,
                    peso: Number(dados.peso),
                    foto: dados.photo
                }
                
                const resulto = await statemento.executeAsync([
                    passou.idPet,
                    Number(dados.donoId),
                    dados.photo||'',
                    String(dados.nome),
                    String(dados.especie),
                    String(dados.dataNasc),
                    String(dados.raca),
                    passou.peso,
                    String(dados.cor),
                    String(dados.genero),
                    String(dados.porte),
                    String(dados.descricao)
                ]);
                const insertedRowId = resulto.lastInsertRowId.toLocaleString()
                statemento.finalizeAsync();
                return { insertedRowId }
            }catch (error) {
                throw error
            }
        }
        if(dados instanceof Vacina){
            try {
                const statementv = await database.prepareAsync(`
                    INSERT INTO vacinas (Id_vacina, id_pet, id_usuario,nomeVac, dataVacina, dataProxDose) VALUES (?, ?, ?, ?, ?, ?)
                    `);
                
                const resultv = await statementv.executeAsync([
                    Number(dados.Id_Vacina),
                    Number(dados.Id_Pet),
                    Number(dados.Id_Usuario),
                    String(dados.Nome),
                    Number(dados.DataVacina),
                    dados.DataProxDose ? Number(dados.DataProxDose) : null
                ]);
                const insertedRowId = resultv.lastInsertRowId.toLocaleString()
                statementv.finalizeAsync();
                return { insertedRowId }
            }catch (error) {
                throw error
            }
        }
        
    }
    async function getUser() {
        try{
            const query = "SELECT * FROM usuarios"
            type userData = {
                Id_Usuario: number
                Nome: string
                Email: string 
                Senha: string 
                Data_Nascimento: string
                Foto: string
                Premium: boolean 
                Notificacao: boolean 
                Tema: string 
                Idioma: string 
            }
            const response = await database.getAllAsync<userData>(query)
            return response
        }catch(error) {
                throw error
        }
        
    }
    async function getAllPets(idUsuario:number) {
        try {
            const query = `SELECT * FROM pet WHERE Id_Usuario = ?`
            type petData = {
                Id_pet: number
                Id_Usuario: number
                Nome: string
                Especie: string 
                Data_nascimento: string
                Raca: string 
                Peso: number 
                Cor: string
                Sexo: string 
                Porte: string 
                Foto:string
                descricao: string
            }
            const response = await database.getAllAsync<petData>(query,[idUsuario])
            
            return response
        } catch (error) {
            throw error
        }
    }
    async function getPet(id:number) {
        try{
            const query = `SELECT * FROM pet WHERE Id_pet = ?`
            type petData = {
                Id_pet: number
                Id_Usuario: number
                Nome: string
                Especie: string 
                Data_nascimento: string
                Raca: string 
                Peso: number 
                Cor: string
                Sexo: string 
                Porte: string 
                Foto:string
                descricao: string
            }
            
            const response = await database.getAllAsync<petData>(query,[id])
            
            return response
        }catch(error) {
            throw error
        }
    }
    async function getVacs(id_pet:number) {
        type vacData = {
            Id_vacina: number
            id_pet: number
            id_usuario: number
            nomeVac: string 
            dataVacina: string
            dataProxDose: string | null
        }
        try {
            const query = `SELECT * FROM vacinas WHERE id_pet = ?`
            const response = await database.getAllAsync<vacData>(query,[id_pet])
            return response
        } catch (error) {
            throw error
        }
    }
    async function update(dados : Usuario|Pet|Vacina|compromisso) {
        if(dados instanceof Usuario){
            try {
                
                const statement = await database.prepareAsync(
                     `UPDATE usuarios SET Nome = ?, Senha = ?, Email = ?, Premium = ?, Data_Nascimento = ?, Foto = ?, Tema = ?, Idioma = ?, Notificacao = ? WHERE Id_Usuario = ?`
                 );
                var passar = {
                    id : Number(dados.Id_usuario),
                    nome : String(dados.nome),
                    foto : String(dados.fotoPerfil),
                    data : Number(dados.dataNascimento)
                }
                
                const result = await statement.executeAsync([
                    passar.nome,
                    dados.senha,
                    dados.email,
                    dados.premium,
                    passar.data,
                    passar.foto||"",
                    dados.tema,
                    dados.idioma,
                    dados.notificacoes,
                    passar.id,
                ])
                const insertedRowId = result.lastInsertRowId.toLocaleString()
                
                statement.finalizeAsync()
                return { insertedRowId }
            } catch (error) {
                throw error
            }
        }
                
         if(dados instanceof Pet){
            try {
                
                
                const statemento = await database.prepareAsync(
                    `UPDATE pet SET foto = ?, Nome = ?, Especie = ?, Data_nascimento = ?, Raca = ?, Peso = ?, Cor = ?, sexo = ?, Porte = ?, Descricao_saude = ? WHERE id_pet = ?`);
                var passou = {
                    idPet: Number(dados.id),
                    dataNascimento: dados.dataNasc,
                    peso: Number(dados.peso),
                    foto: dados.photo
                }
                const resulto = await statemento.executeAsync([
                    dados.photo||'',
                    String(dados.nome),
                    String(dados.especie),
                    String(dados.dataNasc),
                    String(dados.raca),
                    passou.peso,
                    String(dados.cor),
                    String(dados.genero),
                    String(dados.porte),
                    String(dados.descricao),
                    passou.idPet
                ]);
                const insertedRowId = resulto.lastInsertRowId.toLocaleString()
                statemento.finalizeAsync();
                return { insertedRowId }
            }catch (error) {
                throw error
            }
        }
        if(dados instanceof Vacina){
            try {
                const statementv = await database.prepareAsync(`
                    UPDATE vacinas SET  nomeVac = ?, dataVacina = ?, dataProxDose = ? WHERE Id_vacina = ?
                    `);
                
                const resultv = await statementv.executeAsync([
                    String(dados.Nome),
                    Number(dados.DataVacina),
                    dados.DataProxDose ? Number(dados.DataProxDose) : null,
                    Number(dados.Id_Vacina),
                ]);
                const insertedRowId = resultv.lastInsertRowId.toLocaleString()
                statementv.finalizeAsync();
                return { insertedRowId }
            }catch (error) {
                throw error
            }
        }
    }
    async function sair() {
        const del = await database.execAsync("DELETE FROM usuarios")
        const delPet = await database.execAsync("DELETE FROM pet")
        const delVac = await database.execAsync("DELETE FROM vacinas")
        
        return del
    }
    return{create,getUser,getPet,getAllPets,getVacs,update,sair}
}