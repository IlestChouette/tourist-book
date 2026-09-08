-- Ajoute le téléphone de l'hôtelier, collecté à l'inscription — permet de
-- l'identifier et de le contacter même sans réponse à l'email.
alter table hosts add column if not exists phone text;
