#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    # If using python-dotenv for local dev
    # If using python-dotenv for local dev
    try:
        from dotenv import load_dotenv
        # Force load .env from the same directory as manage.py
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
        if os.path.exists(env_path):
            load_dotenv(env_path)
        else:
            print(f"Advertencia: No se encontro archivo .env en {env_path}")
    except ImportError:
        # Fallback: Manual parsing if python-dotenv is not installed
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith('#'):
                            continue
                        if '=' in line:
                            key, value = line.split('=', 1)
                            # Remove quotes if present
                            value = value.strip().strip("'").strip('"')
                            os.environ.setdefault(key.strip(), value)
            except Exception as e:
                print(f"Error reading .env manually: {e}")
        else:
             print(f"Advertencia: No se encontro archivo .env en {env_path}")

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ultragen_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
