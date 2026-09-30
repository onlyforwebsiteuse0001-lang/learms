"""SQL text templates for review/migration; values must be bound parameters."""
POLICY="""ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON {table} USING (tenant_id = current_setting('app.tenant_id', true));"""
def rls_sql(table):
 if not table.isidentifier():raise ValueError('invalid table identifier')
 return POLICY.format(table=table)
