# Mi Taxi Jalisco

Landing page futurista + demo interactiva de la plataforma **Mi Taxi Jalisco**, una alternativa mexicana hecha por y para jaliscienses con 10% de comisión, seguridad conectada al C5 y soporte para taxis formales, informales y autos particulares.

## Stack
- Next.js 15 (App Router, Turbopack)
- Tailwind CSS + Framer Motion
- lucide-react iconos
- Listo para deploy en Vercel
- Fase 2: Neon (Postgres) para DB, Railway opcional para workers

## Correr localmente
```bash
npm install
npm run dev
```
Abre http://localhost:3000

## Estructura
- `app/page.tsx` — landing
- `components/Hero.tsx` — hero + mockup flotante
- `components/Features.tsx` — 14 funciones diferenciadoras
- `components/Compare.tsx` — tabla vs la competencia
- `components/Security.tsx` — capa de seguridad (C5)
- `components/Demo.tsx` — simulador interactivo pasajero/conductor
- `components/Register.tsx` — formulario registro dual

## Deploy
```bash
vercel
```

## Propuesta de mejoras vs la competencia (resumen ejecutivo)

### Económicas
1. **Comisión 10%** vs 30% de la competencia.
2. **Pago al día siguiente** (La competencia: hasta 7 días).
3. **Propina 100% al conductor**.
4. **Sin tarifas dinámicas abusivas** — máximo +20% en horas pico.
5. **Primeros 1,000 conductores: 0% comisión los primeros 3 meses.**

### Seguridad
6. **Botón SOS** conectado directo al C5 Jalisco.
7. **Biometría** (huella/rostro) al iniciar turno.
8. **Verificación 7-pasos** del conductor (INE, antecedentes, vehículo, psicometría, referencias, curso vial, cert. salud).
9. **Rastreo compartido** con contactos de confianza.
10. **Seguro de viaje** incluido para pasajero y conductor.
11. **Datos almacenados en México** bajo leyes mexicanas.

### Inclusión
12. **Taxis informales legalizados** vía programa de formalización con el Gobierno de Jalisco.
13. **Soporte trilingüe**: español, wixárika, inglés.
14. **Pago en efectivo, CoDi, SPEI, vales de despensa, Mercado Pago**.
15. **Programa de salud** (gastos médicos y dental) para conductores activos.

### Producto
16. **Viaje compartido real** (ride-pooling con desconocidos verificados, hasta -40%).
17. **Hasta 5 paradas** por viaje sin cargo extra.
18. **Rutas IA entrenadas con tráfico de GDL/ZMG** (no Google Maps genérico).
19. **Moto-taxi** en zonas de alta congestión.
20. **Programa de lealtad** con puntos canjeables en comercios locales.

### Conductor
21. **Dashboard en tiempo real** de ganancias diarias/semanales.
22. **Adelanto de ganancias** sin intereses (primeros 3 al mes).
23. **Red de talleres aliados** con descuentos.
24. **Academia de conducción defensiva** gratuita online.

## Roadmap técnico
- **Fase 1 (DEMO — hoy)**: Landing + demo interactiva mock.
- **Fase 2**: Backend real (Neon Postgres + Next.js route handlers), auth (Clerk), pagos (Stripe/MercadoPago).
- **Fase 3**: Apps nativas (React Native / Expo) para pasajero y conductor.
- **Fase 4**: Integración real con C5 Jalisco vía API gubernamental.
