d1 setup

➜ soapbox git:(master) ✗ pnpx wrangler d1 create soapbox

⛅️ wrangler 4.50.0
───────────────────
✔ Select an account › 3kh0
✅ Successfully created DB 'soapbox' in region ENAM
Created your new D1 database.

To access your new D1 Database in your Worker, add the following snippet to your configuration file:
{
"d1_databases": [
{
"binding": "soapbox",
"database_name": "soapbox",
"database_id": "5bf3c0c6-9b45-4211-a298-a3367808f1e3"
}
]
}
