select id, name, public from storage.buckets;

select polname, polcmd, pg_get_expr(polwithcheck, polrelid) as with_check_expr
from pg_policy
where polrelid = 'storage.objects'::regclass;
