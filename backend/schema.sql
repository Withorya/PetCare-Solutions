-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: petcare
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alimentador`
--

DROP TABLE IF EXISTS `alimentador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alimentador` (
  `id_Alimentador` int NOT NULL AUTO_INCREMENT,
  `id_pet` int NOT NULL,
  `Id_Usuario` int NOT NULL,
  `tipo_raçao` enum('Filhote','Adulto') DEFAULT NULL,
  `Gramagem` int NOT NULL,
  `Ra_Extra` tinyint(1) DEFAULT '0',
  `ultima_refeicao` datetime DEFAULT NULL,
  `intervalo_horas` int NOT NULL DEFAULT '6',
  PRIMARY KEY (`id_Alimentador`),
  KEY `id_pet` (`id_pet`),
  KEY `Id_Usuario` (`Id_Usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chatperguntas`
--

DROP TABLE IF EXISTS `chatperguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatperguntas` (
  `id_chatPerguntas` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int DEFAULT NULL,
  `id_pet` int DEFAULT NULL,
  `conteudo` text,
  PRIMARY KEY (`id_chatPerguntas`),
  KEY `Id_Usuario` (`Id_Usuario`),
  KEY `id_pet` (`id_pet`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `compromissos`
--

DROP TABLE IF EXISTS `compromissos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compromissos` (
  `id_compromissos` int NOT NULL AUTO_INCREMENT,
  `id_pet` int NOT NULL,
  `Id_Usuario` int NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `descricao` text,
  `Data` date NOT NULL,
  `horario` time DEFAULT NULL,
  PRIMARY KEY (`id_compromissos`),
  KEY `id_pet` (`id_pet`),
  KEY `Id_Usuario` (`Id_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `Id_likes` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int DEFAULT NULL,
  `Id_post` int DEFAULT NULL,
  PRIMARY KEY (`Id_likes`),
  UNIQUE KEY `usuario_postagem` (`Id_Usuario`,`Id_post`),
  KEY `Id_post` (`Id_post`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pet`
--

DROP TABLE IF EXISTS `pet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pet` (
  `id_pet` int NOT NULL,
  `Id_Usuario` int NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Especie` enum('Cão','Gato') NOT NULL,
  `data_nascimento` date NOT NULL,
  `Raça` varchar(100) DEFAULT NULL,
  `Peso` decimal(5,2) DEFAULT NULL,
  `Cor` varchar(50) DEFAULT NULL,
  `Porte` enum('Grande','Médio','Pequeno') NOT NULL,
  `descricao_saude` text,
  `foto` longblob NOT NULL,
  PRIMARY KEY (`id_pet`),
  KEY `Id_Usuario` (`Id_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `postagens`
--

DROP TABLE IF EXISTS `postagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postagens` (
  `Id_post` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int NOT NULL,
  `Titulo` varchar(100) DEFAULT NULL,
  `Conteudo` text,
  `likes` int DEFAULT NULL,
  `DataPost` date DEFAULT NULL,
  PRIMARY KEY (`Id_post`),
  KEY `Id_Usuario` (`Id_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `respostas`
--

DROP TABLE IF EXISTS `respostas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respostas` (
  `Id_respostas` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int NOT NULL,
  `Id_post` int NOT NULL,
  `Conteudo` text NOT NULL,
  `Likes` int DEFAULT '0',
  `DataPost` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id_respostas`),
  KEY `Id_Usuario` (`Id_Usuario`),
  KEY `Id_post` (`Id_post`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Id_Usuario` int NOT NULL,
  `Nome` varchar(100) DEFAULT NULL,
  `Senha` varchar(50) DEFAULT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `Premium` tinyint(1) DEFAULT NULL,
  `Data_Nascimento` date DEFAULT NULL,
  `Foto` blob,
  `Tema` enum('Claro','Escuro') DEFAULT 'Claro',
  `Idioma` enum('Portugues','Ingles','Espanhol') DEFAULT NULL,
  `Notificaçao` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Id_Usuario`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vacinas`
--

DROP TABLE IF EXISTS `vacinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacinas` (
  `Id_vacinas` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_pet` int DEFAULT NULL,
  `nomeVac` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id_vacinas`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_pet` (`id_pet`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-05 20:18:21
