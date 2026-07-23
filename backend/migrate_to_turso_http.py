import sqlite3
import urllib.request
import json

TURSO_URL = "https://solar-db-hriday-bit.aws-ap-south-1.turso.io"
TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ3NDMwODQsImlkIjoiMDE5ZjhhZjktMGEwMS03MGVlLWFlOTgtYzFiYWEwZWU2OWI2Iiwia2lkIjoiblYtWUVkRjNsd3o4QjA5UTFfVm9pU1RZX0lKUWNkd09TMHdMaURZTV9oSSIsInJpZCI6ImVhZmFmMjY1LTFmOTktNDk5Yy04NGY3LTBlZTE0NDI2YTUzZSJ9.n_whbBkuOPXRI2Sh-K07Aa1Oa6aOSFLWTb6xAHMME-JNgMFJ3e9vVzxxOOuwW_BdVnWdjpHNW2GP7AfhEKrGAQ"

def execute_turso(sql, args=()):
    req = urllib.request.Request(f"{TURSO_URL}/v2/pipeline", method="POST")
    req.add_header("Authorization", f"Bearer {TURSO_AUTH_TOKEN}")
    req.add_header("Content-Type", "application/json")
    
    # Format args for Turso
    turso_args = []
    for arg in args:
        if isinstance(arg, int):
            turso_args.append({"type": "integer", "value": str(arg)})
        elif arg is None:
            turso_args.append({"type": "null"})
        else:
            turso_args.append({"type": "text", "value": str(arg)})

    body = {
        "requests": [
            {
                "type": "execute",
                "stmt": {"sql": sql, "args": turso_args}
            },
            {"type": "close"}
        ]
    }
    
    req.data = json.dumps(body).encode("utf-8")
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"Error: {e.read().decode('utf-8')}")
        raise

print("1. Reading local database...")
conn = sqlite3.connect("solar.db")
cursor = conn.cursor()

# Get schema and create tables on Turso
cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL")
tables = cursor.fetchall()

print("2. Creating tables on Turso cloud...")
for (create_sql,) in tables:
    execute_turso(create_sql)

print("3. Migrating data to cloud...")
for table_name in ["admin_users", "products", "contact_submissions", "product_likes"]:
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        if not rows:
            continue
            
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = [col[1] for col in cursor.fetchall()]
        placeholders = ", ".join(["?"] * len(columns))
        
        for row in rows:
            insert_sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
            execute_turso(insert_sql, row)
        print(f"  -> Migrated {len(rows)} rows for table '{table_name}'")
    except sqlite3.OperationalError:
        pass # Table might not exist

conn.close()
print("✅ Migration complete! Your cloud database is now fully synced.")
