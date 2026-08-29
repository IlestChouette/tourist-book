select
  polname as nombre_politica,
  polcmd as comando,
  pg_get_expr(polqual, polrelid) as using_expr,
  pg_get_expr(polwithcheck, polrelid) as with_check_expr
from pg_policy
where polrelid = 'properties'::regclass;
