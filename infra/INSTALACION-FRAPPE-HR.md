# Instalación de Frappe HR (HRMS)

## Qué es Frappe HR

Frappe HR es el módulo open-source de Recursos Humanos y Nómina para ERPNext. Cubre:

- Reclutamiento y ciclo de vida del empleado
- Turnos y asistencia
- Licencias y permisos
- Gastos
- Evaluación de desempeño
- Nómina e impuestos

Repositorio oficial: https://github.com/frappe/hrms

## Prerrequisitos

- Servidor con **frappe-bench** configurado
- **ERPNext** ya instalado y funcionando en el sitio
- Acceso SSH al servidor con usuario de bench (normalmente `frappe`)

## Instalación rápida

### 1. Conectarse al servidor

```bash
ssh usuario@tu-servidor
```

### 2. Ir al directorio de bench

```bash
cd ~/frappe-bench
```

### 3. Ejecutar el script automático

```bash
bash infra/install-frappe-hr.sh
```

O si tienes múltiples sitios:

```bash
bash infra/install-frappe-hr.sh nombre-del-sitio.com
```

### Instalación manual (paso a paso)

```bash
cd ~/frappe-bench

# Descargar la app
bench get-app hrms https://github.com/frappe/hrms

# Instalar en el sitio
bench --site TU_SITIO install-app hrms

# Ejecutar migraciones
bench --site TU_SITIO migrate

# Limpiar caché
bench --site TU_SITIO clear-cache

# Reiniciar servicios
bench restart
```

## Verificación

Después de instalar, accede a tu sitio ERPNext y verifica:

1. En la barra de búsqueda, busca "HR Settings" — debería aparecer
2. En el menú lateral debería aparecer el módulo **Human Resources**
3. Verifica las apps instaladas:

```bash
bench --site TU_SITIO list-apps
```

Deberías ver: `frappe`, `erpnext`, `hrms`

## Actualización

```bash
cd ~/frappe-bench
bench update --pull
bench --site TU_SITIO migrate
bench restart
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `App hrms not found` | Ejecuta `bench get-app hrms` primero |
| Error de permisos | Asegúrate de usar el usuario correcto (normalmente `frappe`) |
| ERPNext no instalado | Instala ERPNext primero: `bench get-app erpnext && bench --site TU_SITIO install-app erpnext` |
| Errores de migración | Revisa logs: `bench --site TU_SITIO migrate --verbose` |
