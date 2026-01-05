import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS usuarios(
            Id_Usuario interger PRIMARY KEY NOT NULL,
            Nome varchar(100),
            Senha varchar(50),
            Email varchar(150),
            Premium tinyint(1) DEFAULT '0',
            Data_Nascimento string,
            Foto blob,
            Tema text DEFAULT 'Claro',
            Idioma text,
            Notificacao tinyint(1) DEFAULT '0'
        );
    `)
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS alimentador (
            id_Alimentador interger PRIMARY KEY NOT NULL,
            id_pet interger NOT NULL,
            Id_Usuario interger NOT NULL,
            tipo_raçao text,
            Gramagem interger NOT NULL,
            ultima_refeicao datetime,
            intervalo_horas interger NOT NULL DEFAULT '6',
            Ra_Extra tinyint(1) DEFAULT '0'
        );
    `)
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS chatperguntas (
            id_chatPerguntas interger PRIMARY KEY NOT NULL,
            Id_Usuario interger,
            id_pet interger,
            conteudo text
        );`)
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS compromissos (
            id_compromissos interger PRIMARY KEY NOT NULL,
            id_pet interger NOT NULL,
            Id_Usuario interger NOT NULL,
            titulo varchar(150),
            descricao text,
            Data varchar(20) NOT NULL,
            horario varchar(20)
        )`);
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS likes (
            Id_likes interger PRIMARY KEY NOT NULL,
            Id_Usuario interger,
            Id_post interger
        );`);
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS pet (
            Id_pet interger PRIMARY KEY NOT NULL,
            Id_Usuario interger NOT NULL,
            Nome varchar(100) NOT NULL,
            Especie text NOT NULL,
            Data_nascimento varchar(20),
            Raca varchar(100),
            Peso decimal(5,2),
            Cor varchar(50),
            Porte text NOT NULL,
            Descricao_saude text,
            Foto blob,
            Sexo text NOT NULL DEFAULT 'macho'
        );`)
    await database.execAsync(`
        CREATE TABLE IF NOT EXISTS vacinas (
            Id_vacinas interger PRIMARY KEY NOT NULL,
            id_usuario interger,
            id_pet interger,
            nomeVac varchar(100),
            dataVacina varchar(20),
            dataProxDose varchar(20)
        );
    `)


    
}