-- ============================================================
-- Execute esse script no MySQL Workbench para adicionar
-- a funcionalidade de ativar/desativar pessoas.
-- ============================================================

USE dbportaria;

-- Adiciona coluna 'ativo' na tabela pessoas
-- 1 = ativa (padrão), 0 = desativada
ALTER TABLE pessoas
  ADD COLUMN ativo TINYINT(1) NOT NULL DEFAULT 1;

-- Confirma a alteração
SELECT 'Coluna ativo adicionada com sucesso!' AS status;
