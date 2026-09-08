# VZ Automotores

Demo comercial de una página web para una concesionaria de automotores en Rojas, Buenos Aires.

## Funciones

- Catálogo de vehículos con filtros
- Favoritos
- Fichas técnicas
- Simulador de financiación
- Formulario de tasación de usados
- Consultas por WhatsApp
- Diseño adaptable a celulares y computadoras
- Inventario almacenado en PostgreSQL
- Solicitudes de tasación guardadas en PostgreSQL
- Funciones backend desplegables en Vercel

## Base de datos

El proyecto utiliza Neon PostgreSQL mediante `DATABASE_URL` o `POSTGRES_URL`. Las tablas `vehicles` y `trade_ins` se crean automáticamente cuando se utiliza la API por primera vez.

> Los vehículos, precios y características iniciales son ilustrativos.
