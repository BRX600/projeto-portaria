-- ============================================================
-- docs/criacao_banco.sql
-- Adaptado de "Criacao tabela veiculos.sql" do projeto base.
--
-- Cria o banco de dados e as tabelas para o sistema de Portaria de Pessoas.
--
-- Tabelas:
--   pessoas  — cadastro de pessoas (Nome + Documento)
--   acessos  — registro de entradas e saídas
--
-- Execute no MariaDB/MySQL:
--   mariadb -u root -p < docs/criacao_banco.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS dbportaria
    CHARACTER SET utf8mb4;

USE dbportaria;

-- ============================================================
-- Tabela: pessoas
-- Armazena o cadastro de pessoas que podem acessar o local.
-- ============================================================
CREATE TABLE IF NOT EXISTS pessoas (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(150) NOT NULL,
    documento  VARCHAR(30)  NOT NULL,          -- CPF ou RG
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX idx_documento (documento)     -- evita duplicatas de documento
);

-- ============================================================
-- Tabela: acessos
-- Registra cada entrada e saída de uma pessoa.
--
-- status:
--   'dentro'   = pessoa entrou, ainda não saiu
--   'saiu'     = saída registrada
--
-- Regras de negócio garantidas pelo sistema (controller):
--   - Não pode ter dois registros 'dentro' para a mesma pessoa
--   - Não pode registrar saída sem ter entrado (status = 'dentro')
-- ============================================================
CREATE TABLE IF NOT EXISTS acessos (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    pessoa_id  BIGINT       NOT NULL,
    status     ENUM('dentro', 'saiu') NOT NULL DEFAULT 'dentro',
    entrada    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    saida      DATETIME,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id),
    INDEX idx_pessoa_status (pessoa_id, status)   -- busca rápida por pessoa ativa
);

-- ============================================================
-- Dados de exemplo para teste
-- ============================================================
INSERT INTO pessoas (nome, documento) VALUES
  ('Maria Oliveira',  '123.456.789-00'),
  ('João da Silva',   '987.654.321-11'),
  ('Ana Souza',       'MG-12.345.678');

-- Simula histórico: Maria entrou e saiu, João ainda está dentro
INSERT INTO acessos (pessoa_id, status, entrada, saida) VALUES
  (1, 'saiu',   NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR),
  (2, 'dentro', NOW() - INTERVAL 30 MINUTE, NULL);

-- ============================================================
-- Consultas úteis para verificar:
-- SELECT * FROM pessoas;
-- SELECT a.*, p.nome FROM acessos a JOIN pessoas p ON p.id = a.pessoa_id ORDER BY a.entrada DESC;
-- SELECT * FROM acessos WHERE status = 'dentro';
-- ============================================================
