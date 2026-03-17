import json
import os
import subprocess
import sys

def load_stable(filename):
    if not os.path.exists(filename):
        print(f"Error: No se encontró el archivo {filename}")
        return False

    python_exe = sys.executable
    manage_py = os.path.join(os.path.dirname(__file__), 'manage.py')

    print(f"--> Intentando carga completa de {filename}...")
    sys.stdout.flush()
    
    # Intento 1: Carga completa (Más rápido pero puede fallar en DBs muy grandes)
    try:
        res = subprocess.run([python_exe, manage_py, 'loaddata', filename], capture_output=True, text=True, encoding='utf-8')
        if res.returncode == 0:
            print(f"¡ÉXITO! Carga completa finalizada.")
            print(res.stdout.strip())
            sys.stdout.flush()
            return True
        else:
            print("Carga completa falló (posible límite de Neon). Intentando carga por bloques...")
            print(f"Error detectado: {res.stderr[:200]}...")
            sys.stdout.flush()
    except Exception as e:
        print(f"Error en intento de carga completa: {e}")
        sys.stdout.flush()

    # Intento 2: Carga por bloques agrupados (Optimizado)
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

    models = {}
    for item in data:
        m = item['model']
        if m not in models:
            models[m] = []
        models[m].append(item)

    # Orden de carga para evitar problemas de dependencias
    load_order = [
        'core.diario', 'core.tomo', 'core.capitulo', 'core.personaje',
        'core.expediente', 'core.tablero', 'core.recuerdoleticia',
        'core.promptcategoria', 'core.promptai', 'core.capituloimagen', 
        'core.capituloslap', 'core.capitulopista', 'core.capituloprompt'
    ]
    
    for m in models.keys():
        if m not in load_order:
            load_order.append(m)

    success = True
    # Agrupamos en bloques de 3 modelos para reducir conexiones de red
    chunk_size = 3
    num_batches = (len(load_order) + chunk_size - 1) // chunk_size
    
    for idx, i in enumerate(range(0, len(load_order), chunk_size)):
        batch = load_order[i:i + chunk_size]
        items_to_load = []
        models_in_batch = []
        
        for model_name in batch:
            if model_name in models:
                items_to_load.extend(models[model_name])
                models_in_batch.append(model_name)
        
        if not items_to_load:
            continue
            
        tmp_file = f"tmp_batch_{i}.json"
        with open(tmp_file, 'w', encoding='utf-8') as f:
            json.dump(items_to_load, f, ensure_ascii=False)
            
        print(f"--> [{idx+1}/{num_batches}] Cargando bloque: {', '.join(models_in_batch)} ({len(items_to_load)} objetos)...")
        sys.stdout.flush()
        try:
            res = subprocess.run([python_exe, manage_py, 'loaddata', tmp_file], capture_output=True, text=True, encoding='utf-8')
            if res.returncode != 0:
                print(f"ERROR en bloque {batch}: {res.stderr}")
            else:
                print(f"OK: {res.stdout.strip()}")
            sys.stdout.flush()
        finally:
            if os.path.exists(tmp_file):
                os.remove(tmp_file)
                
    return success

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python MANAGER_LOAD_STABLE.py <archivo.json>")
        sys.exit(1)
    
    if load_stable(sys.argv[1]):
        print("\nCarga completada con éxito.")
        sys.exit(0)
    else:
        print("\nHubo errores durante la carga.")
        sys.exit(1)
