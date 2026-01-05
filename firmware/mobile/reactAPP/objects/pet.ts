
import { promises } from "dns";
import { Vacina } from "./vacina";


class Pet{
    id?: number;
    nome: string;
    dataNasc: string
    raca: string;
    peso: number
    cor: string;
    porte: string;
    especie : string;
    genero: string;
    donoId: number;
    photo?: string;
    descricao? : string
    uriFoto?: Uint8Array
    vacinas?: Array<Vacina>;

    constructor(especie : string,nome: string, dataNasc: string, raca: string, peso: number, cor: string, porte: string, genero: string, donoId: number){
       
        this.nome = nome;
        this.dataNasc = dataNasc;
        this.raca = raca;
        this.peso = peso;
        this.cor = cor;
        this.porte = porte;
        this.genero = genero;
        this.donoId = donoId;
        this.especie =especie
        
    }

    public async register(): Promise<number> {
        var resposta = 0;
        
        await fetch('https://api-rest-comedouro-2poss.onrender.com/pet/novoPet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nome: this.nome,
                data_nascimento: this.dataNasc,
                Raca: this.raca,
                Peso: this.peso,
                Cor: this.cor,
                Porte: this.porte,
                Genero: this.genero,
                id_Usuario: this.donoId,
                Especie: this.especie
            })
        }).then(response => {
            
            if (response.status == 400) {
                resposta = 400;
            }
            if (response.status == 500) {
                resposta = 500;
            }
            //corrigir o erro daqui
            return response.json()
        }).then(data => {
            this.id = data.Id_pet;
        })
        return resposta;
    }

    public async update(files:any):Promise<number>{
        var resposta = 0 
        const formData = new FormData();
        try {

            formData.append('Nome', this.nome )
            formData.append('Especie', this.especie) 
            formData.append('data_nascimento', this.dataNasc) 
            formData.append('Raca', this.raca) 
            formData.append('Peso', this.peso.toString()) 
            formData.append('Cor', this.cor) 
            formData.append('Porte', this.porte) 
            formData.append('Genero', this.genero) 
            formData.append('descricao_saude', String(this.descricao)) 
            formData.append('arquivo_blob', files);

        } catch (error) {
            console.error('Erro durante o processo de upload:', error);
        }
        
        await fetch('https://api-rest-comedouro-2poss.onrender.com/pet/atualizarPet/'+this.id,{
            method: 'PUT',
            body:formData
        }).then((response)=>{
            if (response.status == 400) {
                resposta = 400;
                console.log(resposta)
                return response
            }
            if (response.status == 404) {
                resposta = 404;
                console.log(resposta)
                return response
            }
            if (response.status == 500) {
                resposta = 500;
                console.log(resposta)
                return response
            }
            console.log(resposta)
            return response
            
        })
        if (resposta == 0) {
            await fetch("https://api-rest-comedouro-2poss.onrender.com/pet/"+this.id,{
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
                    this.nome = jsonBody.Nome , 
                    this.especie =jsonBody.Especie , 
                    this.dataNasc =jsonBody.data_nascimento, 
                    this.raca= jsonBody.Raca , 
                    this.peso= jsonBody.Peso , 
                    this.cor= jsonBody.Cor , 
                    this.porte= jsonBody.Porte , 
                    this.genero =jsonBody.Genero , 
                    this.descricao=jsonBody.descricao_saude , 
                    this.uriFoto= jsonBody.foto  
                    
                    if(jsonBody.foto.data.length!=0) {
                    
                        const buffer: Buffer = Buffer.from(jsonBody.foto.data);
                        
                        // 2. Converter o Buffer para uma string Base64
                        const base64String: string = buffer.toString('base64');
                        
                        // 3. Montar a URI completa (Data URL)
                        const uri: string = `data:image/jpeg;base64,${base64String}`;
                        console.log(uri)
                        // data[0].Foto
                        // body: JSON.stringify({
                
                
                        this.photo = uri
                    }
                }
                
            })
        }
        return resposta
    }
    
    public async registerVac(nomeVac:string, dataVac:Date, dataProxDose:Date|null): Promise<number> {
        var resposta = 0;
        await fetch('https://api-rest-comedouro-2poss.onrender.com/pet/vacinarPet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //id_pet, id_usuario, nomeVac, dataVacina, dataProxDose
            body: JSON.stringify({
                id_pet: this.id,
                id_usuario: this.donoId,
                nomeVac: nomeVac,
                dataVacina: dataVac,
                dataProxDose: dataProxDose
            })
        }).then(response => {
            if (response.status == 400) {
                resposta = 400;
                return response
            }
            if (response.status == 500) {
                resposta = 500;
                return response
            }
            
            if (response.status == 201) {
                resposta = 201;
                return response
            }
        })
        
        return resposta
    }

    public async searchVacinas(): Promise<number> {
        var resposta = 0;
        await fetch('https://api-rest-comedouro-2poss.onrender.com/pet/vacinasPet/'+this.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status == 400) {
                resposta = 400;
                return
            }
            if (response.status == 500) {
                resposta = 500;
                return
            }
            if (response.status == 404) {
                resposta = 404;
                return 
            }
            
            return response.json()
        }).then(data => {
            if (data == null) {
                return
            }
            this.vacinas = new Array<Vacina>();
            data.forEach((vacinaData:any) => {
                
                const vacina = new Vacina(
                    vacinaData.Id_vacinas,
                    vacinaData.id_pet,
                    vacinaData.id_usuario,
                    vacinaData.nomeVac,
                    vacinaData.DataVacina.slice(0,10),
                    vacinaData.DataProxDose ? vacinaData.DataProxDose.slice(0,10) : undefined
                );
                
                this.vacinas?.push(vacina);
            });
        })
        
        return resposta
    }

}

export { Pet }