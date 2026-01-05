
import { use } from "react";
import { Pet } from "./pet";
import { Buffer } from 'buffer'

class Usuario {
    public Id_usuario: number | undefined
    public nome: string | undefined
    public email: string 
    public senha: string 
    public dataNascimento: string | undefined
    public fotoPerfil?: string
    public premium: boolean = false
    public notificacoes: boolean = true
    public tema: string = "Claro"
    public idioma: string = 'Portugues'
    public pets?: Pet[]


    constructor(  Email: string , Senha: string ,Nome?: string , Data_nascimento?: string) {
        this.nome = Nome
        this.email = Email
        this.senha = Senha
        this.dataNascimento = Data_nascimento
        
    }
    

    public async register(): Promise<number> {
        var resposta = 0;
        await fetch('https://api-rest-comedouro-2poss.onrender.com/usuario/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nome: this.nome,
                Email: this.email,
                Senha: this.senha,
                Data_nascimento: this.dataNascimento
            })
        }).then(response => {
            if (response.status == 400) {
                resposta = 400;
                return
            }
            if(response.status == 409){
                resposta = 409;
                return
            }
            if (response.status == 500) {
                resposta = 500;
                return
            }
        })
        await this.login()
        return resposta
    }

    public async login(): Promise<number> {
        var resposta = 0
        await fetch("https://api-rest-comedouro-2poss.onrender.com/usuario/login?Email="+this.email+"&Senha="+this.senha,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response =>{
            if (response.status == 400) {
                resposta = 400;
                return
            }
            if(response.status == 404){
                resposta = 404;
                return
            }
            if (response.status == 500) {
                resposta = 500;
                return
            }
            
            return response.json()
        }).then(jsonBody=>{
            if (jsonBody) {
                this.Id_usuario = jsonBody.Id_Usuario
                this.nome = jsonBody.Nome
                this.email = jsonBody.Email 
                this.senha = jsonBody.Senha 
                this.dataNascimento = jsonBody.Data_Nascimento.slice(0,10)
                this.fotoPerfil = jsonBody.Foto
                this.premium = jsonBody.Premium
                this.notificacoes = jsonBody.Notificacao
                this.tema = jsonBody.Tema
                this.idioma = jsonBody.Idioma
            }
            
        })
        return resposta
    }   
    public update(): Promise<Response> {
        const dados = fetch("https://api-rest-comedouro-2poss.onrender.com/usuario/atualizar",{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id_usuario: this.Id_usuario,
                Nome: this.nome,
                Email: this.email,
                Senha: this.senha,
                Data_nascimento: this.dataNascimento,
                Foto_perfil: this.fotoPerfil,
                Premium: this.premium,
                Notificacoes: this.notificacoes,
                Tema: this.tema,
                Idioma: this.idioma
            })
        })
        return dados
    }
    
    public addPet(pet: any){
        if(this.pets){
            this.pets.push(pet)
        }else{
            this.pets = [pet]
        }   
    }
    
    public async getPets(){
         await fetch("https://api-rest-comedouro-2poss.onrender.com/pet/meuspets/"+this.Id_usuario,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response=>{
            if (response.status == 400) {
                return
            }
            if(response.status == 404){
                return
            }
            if (response.status == 500) {
                return
            }
            return response.json()
        }).then(dados=>{
            dados.map((pet:any)=>{
                
                const animal = new Pet(pet.Especie,pet.Nome,pet.data_nascimento.slice(0,10),pet.Raca,pet.Peso,pet.Cor,pet.Porte,pet.sexo,pet.Id_Usuario)
                animal.id = pet.id_pet
                animal.descricao = pet.descricao_saude
                
                animal.uriFoto = pet.foto.data
                if(pet.foto.data.length!=0) {
                    
                    const buffer: Buffer = Buffer.from(pet.foto.data);
                    
                    // 2. Converter o Buffer para uma string Base64
                    const base64String: string = buffer.toString('base64');
                    
                    // 3. Montar a URI completa (Data URL)
                    const uri: string = `data:image/jpeg;base64,${base64String}`;
                    // data[0].Foto
                    
                    animal.photo = uri
                }
                // proximo passo é atualizar no banco (local e nuvem) quando seleciona imagem
                // terminar os posts <amanhã^
                this.addPet(animal)
                
            })
        })
    }
}
export { Usuario };