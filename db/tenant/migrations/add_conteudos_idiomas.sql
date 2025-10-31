-- Migration: Add idiomas (languages) support to conteudos
-- Allows content to be available in multiple languages based on site configuration

-- Add idiomas column to store array of language codes
ALTER TABLE [dbo].[conteudos]
ADD [idiomas] [nvarchar](500) NULL; -- JSON array of language codes, e.g., ["pt-PT", "en", "es"]

-- Add default value for existing records (all languages available, or null)
-- You can update this based on your business logic
UPDATE [dbo].[conteudos]
SET [idiomas] = NULL  -- NULL means available in all languages
WHERE [idiomas] IS NULL;

-- Create index for better performance when filtering by language
CREATE INDEX [IX_conteudos_idiomas] ON [dbo].[conteudos]([idiomas]);

-- Example: If you want to set all existing content to Portuguese by default
-- UPDATE [dbo].[conteudos]
-- SET [idiomas] = '["pt-PT"]'
-- WHERE [idiomas] IS NULL;

PRINT 'Migration completed: idiomas column added to conteudos table';
