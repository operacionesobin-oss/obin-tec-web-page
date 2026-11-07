#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Frappe HR (HRMS) — Script de instalación para servidor con ERPNext
# ============================================================================
#
# USO:
#   ssh usuario@servidor
#   bash install-frappe-hr.sh [NOMBRE_DEL_SITIO]
#
# PREREQUISITOS:
#   - frappe-bench ya instalado y funcionando
#   - ERPNext ya instalado en el sitio
#   - Usuario con permisos de bench (normalmente 'frappe')
#
# Si no se pasa NOMBRE_DEL_SITIO, usa el sitio por defecto del bench.
# ============================================================================

SITE_NAME="${1:-}"
HRMS_REPO="https://github.com/frappe/hrms"
BENCH_DIR=""

# --- Detectar directorio de bench ---
detect_bench_dir() {
    if [ -f "sites/common_site_config.json" ]; then
        BENCH_DIR="$(pwd)"
    elif [ -f "$HOME/frappe-bench/sites/common_site_config.json" ]; then
        BENCH_DIR="$HOME/frappe-bench"
    else
        for dir in "$HOME"/*/sites/common_site_config.json; do
            if [ -f "$dir" ]; then
                BENCH_DIR="$(dirname "$(dirname "$dir")")"
                break
            fi
        done
    fi

    if [ -z "$BENCH_DIR" ]; then
        echo "ERROR: No se encontró un directorio frappe-bench."
        echo "Ejecuta este script desde el directorio de bench o asegúrate de que existe en ~/frappe-bench"
        exit 1
    fi

    echo ">> Bench encontrado en: $BENCH_DIR"
    cd "$BENCH_DIR"
}

# --- Detectar sitio ---
detect_site() {
    if [ -z "$SITE_NAME" ]; then
        if [ -f "sites/currentsite.txt" ]; then
            SITE_NAME=$(cat sites/currentsite.txt | tr -d '[:space:]')
            echo ">> Usando sitio por defecto: $SITE_NAME"
        else
            echo "ERROR: No se encontró sitio por defecto. Pasa el nombre del sitio como argumento."
            echo "  Uso: bash install-frappe-hr.sh mi-sitio.localhost"
            exit 1
        fi
    else
        echo ">> Usando sitio: $SITE_NAME"
    fi

    if [ ! -d "sites/$SITE_NAME" ]; then
        echo "ERROR: El directorio del sitio 'sites/$SITE_NAME' no existe."
        exit 1
    fi
}

# --- Verificar que ERPNext está instalado ---
check_erpnext() {
    echo ">> Verificando que ERPNext está instalado..."
    if ! bench --site "$SITE_NAME" list-apps 2>/dev/null | grep -q "erpnext"; then
        echo "ERROR: ERPNext no está instalado en $SITE_NAME."
        echo "Frappe HR requiere ERPNext. Instálalo primero:"
        echo "  bench get-app erpnext"
        echo "  bench --site $SITE_NAME install-app erpnext"
        exit 1
    fi
    echo "   ERPNext está instalado."
}

# --- Verificar si HRMS ya está instalado ---
check_existing_hrms() {
    if bench --site "$SITE_NAME" list-apps 2>/dev/null | grep -q "hrms"; then
        echo ">> Frappe HR (hrms) ya está instalado en $SITE_NAME."
        echo "   Si quieres actualizar, ejecuta: bench update --pull"
        exit 0
    fi
}

# --- Instalar HRMS ---
install_hrms() {
    echo ""
    echo "============================================"
    echo "  Instalando Frappe HR en: $SITE_NAME"
    echo "============================================"
    echo ""

    if [ ! -d "apps/hrms" ]; then
        echo ">> Descargando app hrms..."
        bench get-app hrms "$HRMS_REPO"
    else
        echo ">> App hrms ya descargada, saltando get-app."
    fi

    echo ">> Instalando hrms en el sitio..."
    bench --site "$SITE_NAME" install-app hrms

    echo ">> Ejecutando migraciones..."
    bench --site "$SITE_NAME" migrate

    echo ">> Limpiando caché..."
    bench --site "$SITE_NAME" clear-cache

    echo ""
    echo "============================================"
    echo "  Frappe HR instalado exitosamente"
    echo "============================================"
    echo ""
    echo "Apps instaladas en $SITE_NAME:"
    bench --site "$SITE_NAME" list-apps
    echo ""
    echo "Reinicia bench para aplicar todos los cambios:"
    echo "  bench restart"
    echo ""
}

# --- Main ---
main() {
    echo ""
    echo "=== Frappe HR (HRMS) — Instalador ==="
    echo ""

    detect_bench_dir
    detect_site
    check_erpnext
    check_existing_hrms
    install_hrms
}

main
