# Verificación de la demostración VZ Automotores

Fecha: 2026-09-08.

## Datos conservados

- Se conservó el Toyota Corolla previamente cargado por el usuario.
- Se agregaron cuatro publicaciones de demostración: Toyota Corolla XEi CVT 2017, Volkswagen Taos Comfortline 250 TSI 2022, Chevrolet Tracker Premier 1.2 Turbo 2024 y Volkswagen Golf Highline 1.4 TSI DSG 2018.
- Fotografías reales de referencia del modelo; no se certifica que pertenezcan a una unidad del año o acabado exacto. Precios, kilometrajes y estados son ficticios y están indicados como demostración.
- 9 consultas, 5 tasaciones y 5 solicitudes de financiación ficticias. Sin teléfonos ni correos de terceros.
- 20 movimientos explícitamente simulados, más los eventos de las tres solicitudes de prueba por HTTP.

## Pruebas realizadas

- Catálogo publicado: 5 vehículos leídos de Supabase.
- Las 5 imágenes del catálogo cargaron con naturalWidth mayor que cero.
- Favorito: el botón del Corolla cambió a corazón activo.
- Ficha: abrió el Corolla con año, motor, transmisión y precio correspondientes al registro.
- Filtro Volkswagen: devolvió Taos y Golf, 2 resultados.
- Simulador: al seleccionar 36 cuotas actualizó la estimación a $825.694 con valor $32.500.000 y anticipo $12.000.000.
- Base de datos: creación, actualización de precio, cambio a Reservado y eliminación de una fila temporal, verificados dentro de una transacción revertida.
- Cinco APIs administrativas rechazaron solicitudes sin sesión con HTTP 401.
- Consulta y financiación por /api/submit: HTTP 201; persistencia confirmada por SQL.
- Tasación por /api/trade-ins: HTTP 201; persistencia confirmada. Kilometraje negativo: HTTP 400.

## Corrección publicada

/api/trade-ins todavía usaba la conexión anterior. Ahora transforma el formulario público y guarda mediante /api/submit en Supabase. Publicación Vercel READY: dpl_4CpQE3LcrKSRQasYYQbvYT7aXifq.

## Límite de la verificación

El navegador de prueba no tiene una sesión de administrador. No se verificaron desde los botones privados la carga de fotos, creación, edición, eliminación y configuración con autenticación. Las pruebas SQL y de API no sustituyen esa prueba de interfaz. No se enviaron WhatsApp, emails ni notificaciones a personas.
