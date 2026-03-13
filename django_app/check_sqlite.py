import sqlite3

db_path = 'c:/ultragen2026/ultragen_manager/django_app/db.sqlite3'

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM core_capitulo")
    count = cursor.fetchone()[0]
    print(f"Total capítulos en db.sqlite3: {count}")
    
    cursor.execute("SELECT id, nombre, is_active FROM core_capitulo ORDER BY id DESC LIMIT 5")
    rows = cursor.fetchall()
    print("\nÚltimos 5 capítulos en sqlite:")
    for row in rows:
        print(f"ID: {row[0]}, Nombre: {row[1]}, Activo: {row[2]}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
