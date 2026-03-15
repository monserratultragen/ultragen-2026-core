import json
import os
import subprocess
import sys

def load_stable(filename):
    if not os.path.exists(filename):
        print(f"Error: No se encontró el archivo {filename}")
        return False

    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Agrupar por modelo para cargar en orden
    models = {}
    for item in data:
        m = item['model']
        if m not in models:
            models[m] = []
        models[m].append(item)

    # Orden de carga recomendado para evitar problemas de dependencias
    load_order = [
        'core.diario', 'core.tomo', 'core.capitulo', 'core.personaje',
        'core.expediente', 'core.tablero', 'core.recuerdoleticia',
        'core.promptcategoria', 'core.promptai', 'core.capituloimagen', 
        'core.capituloslap', 'core.capitulopista', 'core.capituloprompt'
    ]
    
    # Agregar el resto de modelos que no estén en la lista
    for m in models.keys():
        if m not in load_order:
            load_order.append(m)

    python_exe = sys.executable
    manage_py = os.path.join(os.path.dirname(__file__), 'manage.py')

    success = True
    for model_name in load_order:
        if model_name not in models:
            continue
            
        items = models[model_name]
        tmp_file = f"tmp_load_{model_name.replace('.', '_')}.json"
        
        with open(tmp_file, 'w', encoding='utf-8') as f:
            json.dump(items, f)
            
        print(f"--> Cargando {model_name} ({len(items)} objetos)...")
        try:
            # Ejecutamos loaddata para este fragmento
            res = subprocess.run([python_exe, manage_py, 'loaddata', tmp_file], capture_output=True, text=True, encoding='utf-8')
            if res.returncode != 0:
                print(f"ERROR en {model_name}: {res.stderr}")
                success = False
            else:
                print(f"OK: {res.stdout.strip()}")
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
