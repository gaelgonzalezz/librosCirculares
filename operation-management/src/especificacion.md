
# Contexto General

Estamos en un entorno de desarrollo (repositorio) multiproyecto programado en TypeScript, con Node versión 24.x y NestJS versión 11.x, bajo el nombre de "Libros Circulares". La arquitectura está orientada en capas y dividida en dominios que se comunican mediante API REST. No hay base de datos persistente; todos los servicios persisten su estado en memoria utilizando listas/colecciones dentro de los propios servicios de NestJS. No se deben generar tests ni capas innecesarias fuera del servicio.

El sistema general gestiona el préstamo, devolución, cesión de propiedad y baja de ejemplares de obras literarias a través de 4 multiservicios que interactúan entre sí:

1. `copy-management` (Servicio I): Servicio central de ejemplares, obras, ediciones y autores. Registra el dueño actual del ejemplar y quién lo tiene en su poder.


2. `operation-management` (Servicio II): Servicio central de operaciones sobre ejemplares (préstamo, devolución, cesión de propiedad y baja de ejemplar).


3. `user-management` (Servicio III): Servicio de gestión de personas, medios de contacto, representantes y comunidades.


4. `recomendation-management` (Servicio IV): Servicio de recomendaciones basado en historial y consulta a sistema externo (BookIA).



---

# Contexto General de este Servicio (operation-management)

Este servicio implementa la gestión de todo el ciclo de operaciones sobre los ejemplares dentro del circuito de circulación:

* **Restricción de Comunidad:** Toda operación de libros (préstamos y cesiones) solo puede realizarse entre personas que pertenezcan a la **misma comunidad**. Antes de registrar un préstamo o cesión, se debe verificar que tanto la persona de origen como la de destino compartan al menos una comunidad activa común (consultando al Servicio III `user-management`).


* **Préstamo:** Una persona que tiene físicamente un ejemplar en su poder lo cede temporalmente a otra. **Regla estricta:** Solo puede prestar el ejemplar quien lo tiene actualmente en su poder. Incluso el dueño/propietario no puede prestarlo si no lo tiene en su poder en ese momento. La propiedad del libro no cambia durante el préstamo.


* **Devolución:** Se produce por el vencimiento del préstamo sin que haya surgido un nuevo préstamo encadenado, haciendo que el ejemplar retorne físicamente a su propietario legal. Quien lo tenía en su poder deja de tenerlo y el poseedor vuelve a ser el dueño.


* **Cesión de Propiedad:** Es el cambio de dueño legal del ejemplar. **Regla estricta:** Solo puede ser realizada por el propietario actual. Para ceder la propiedad no es necesario tener el ejemplar en su poder material y puede transferirse en cualquier momento a cualquier usuario de la comunidad.


* **Baja de Ejemplar:** Implica que un ejemplar deja de estar disponible y sale del circuito de circulación. Sobre un ejemplar dado de baja no se puede realizar ninguna operación futura. Solo puede darlo de baja su propietario y cuando no existan préstamos activos pendientes sobre él.


* **Consulta de Operaciones Abiertas (para Servicio III):** Este servicio expone un endpoint de verificación que consume `user-management` para saber si un usuario puede desvincularse de una comunidad. Un usuario no puede desvincularse si tiene préstamos activos (como poseedor o prestatario) en dicha comunidad.



---

# Restricciones Técnicas

* **Runtime:** Node.js v24.x.
* **Framework:** NestJS v11.x (TypeScript).
* **Persistencia:** En memoria (arreglos dentro de los providers/services de NestJS).
* **IDs:** Autoincrementales numéricos independientes por entidad (`id = 1, 2, 3...`).
* **Sin base de datos ni tests unitarios/e2e.**
* **Comunicación Externa (HTTP REST):**
* Consulta a `copy-management` (Servicio I): Para obtener o actualizar poseedor actual y dueño actual de un ejemplar.


* Consulta a `user-management` (Servicio III): Para validar pertenencia a comunidades de los involucrados.





---

# Especificación de Este Servicio

## Entidades a Modelar

### Operacion (Modelo Polimórfico / Discriminado)

```typescript
type TipoOperacion = 'PRESTAMO' | 'DEVOLUCION' | 'CESION' | 'BAJA';
type EstadoOperacion = 'ABIERTA' | 'CERRADA';

class Operacion {
  id: number;
  tipo: TipoOperacion; //esto es un enum
  ejemplarId: number; 
  comunidadId: number;
  personaOrigenId: number; // Quien entrega / transfiere / da de baja
  personaDestinoId?: number; // Quien recibe (en PRESTAMO y CESION)
  fechaInicio: string; // ISO String YYYY-MM-DDTHH:mm:ssZ
  fechaFin?: string; // ISO String si fue cerrada/devuelta
  estado: EstadoOperacion; // ABIERTA (en curso) o CERRADA (completada)
}

```

---

## Operaciones Permitidas - Flujos

### 1. Registrar Préstamo de Ejemplar

* **Ruta:** `POST /operaciones/prestamo`
* **Input (Body):**
```json
{
  "ejemplarId": 10,
  "comunidadId": 2,
  "personaPrestamistaId": 1,
  "personaReceptoraId": 4
}

```


* **Output:**
```json
{
  "id": 1,
  "mensaje": "Préstamo registrado exitosamente"
}

```


* **Códigos de Estado HTTP:**
* `201 Created`: Préstamo registrado y activado.
* `400 Bad Request`: Datos faltantes, el prestatario es la misma persona, o las personas no comparten la comunidad indicada.


* `404 Not Found`: Ejemplar o personas no encontrados.
* `409 Conflict`:
* El ejemplar está dado de baja.


* Quien presta (`personaPrestamistaId`) **no tiene el ejemplar en su poder actualmente** (validado contra Servicio I).


* El ejemplar ya tiene una operación abierta no concluida que impide el nuevo préstamo.






* **Debe:**
* Crear la operación de tipo `PRESTAMO` en estado `ABIERTA`.
* Si existía un préstamo abierto previo sobre este ejemplar que habilita el préstamo encadenado (A $\rightarrow$ B $\rightarrow$ C), cerrar la operación previa (`estado = 'CERRADA'`) y abrir la nueva con el nuevo receptor.


* Actualizar en el Servicio I (`copy-management`) el nuevo poseedor del ejemplar (`poseedorId = personaReceptoraId`).



---

### 2. Registrar Devolución de Ejemplar

* **Ruta:** `POST /operaciones/devolucion`
* **Input (Body):**
```json
{
  "ejemplarId": 10,
  "comunidadId": 2
}

```


* **Output:**
```json
{
  "id": 2,
  "mensaje": "Devolución registrada exitosamente. El ejemplar regresó al propietario"
}

```


* **Códigos de Estado HTTP:**
* `200 OK` / `201 Created`: Devolución registrada con éxito.


* `400 Bad Request`: Parámetros inválidos.
* `404 Not Found`: Ejemplar no encontrado o no tiene préstamos activos.


* `409 Conflict`: El ejemplar no se encuentra en préstamo activo o ya está en poder del dueño.




* **Debe:**
* Identificar la operación de `PRESTAMO` actualmente `ABIERTA` para ese ejemplar y marcarla como `CERRADA` con su `fechaFin`.
* Crear un registro de tipo `DEVOLUCION` en estado `CERRADA`.
* Notificar al Servicio I (`copy-management`) para restablecer el poseedor actual al ID del dueño original del ejemplar (`poseedorId = duenoId`).





---

### 3. Registrar Cesión de Propiedad

* **Ruta:** `POST /operaciones/cesion`
* **Input (Body):**
```json
{
  "ejemplarId": 10,
  "comunidadId": 2,
  "duenoActualId": 1,
  "nuevoDuenoId": 5
}

```


* **Output:**
```json
{
  "id": 3,
  "mensaje": "Cesión de propiedad completada exitosamente"
}

```


* **Códigos de Estado HTTP:**
* `201 Created`: Cesión realizada exitosamente.
* `400 Bad Request`: Ambas partes no pertenecen a la comunidad, o el nuevo dueño es igual al actual.


* `404 Not Found`: Ejemplar o usuarios no existentes.
* `409 Conflict`:
* El ejemplar está dado de baja.


* `duenoActualId` **no es el propietario legítimo** registrado en el Servicio I.






* **Debe:**
* Permitir la cesión incluso si el dueño no tiene el ejemplar físicamente en su poder. El poseedor material actual se mantiene inalterado en Servicio I; únicamente se transfiere la titularidad (`duenoId = nuevoDuenoId`).


* Registrar la operación de tipo `CESION` como `CERRADA`.



---

### 4. Registrar Baja de Ejemplar

* **Ruta:** `POST /operaciones/baja`
* **Input (Body):**
```json
{
  "ejemplarId": 10,
  "comunidadId": 2,
  "propietarioId": 1,
  "motivo": "Ejemplar deteriorado / extraviado"
}

```


* **Output:**
```json
{
  "id": 4,
  "mensaje": "Baja del ejemplar confirmada. No se permitirán más operaciones sobre él"
}

```


* **Códigos de Estado HTTP:**
* `200 OK` / `201 Created`: Baja efectuada con éxito.


* `400 Bad Request`: Datos insuficientes.
* `404 Not Found`: Ejemplar no encontrado.
* `409 Conflict`:
* Quien solicita la baja no es el propietario del ejemplar.
* El ejemplar tiene operaciones de préstamo abiertas/en curso (debe devolverse antes de darse de baja).






* **Debe:**
* Registrar la operación `BAJA` como `CERRADA`.
* Notificar al Servicio I (`copy-management`) para marcar el ejemplar como `inactivo` / `dado_de_baja`.





---

### 5. Consultar Operaciones Cerradas / Abiertas de una Persona (Consumido por Servicio III)

* **Ruta:** `GET /personas/:id/operaciones?idComunidad=:comunidadId`
* **Input:** Parámetro de ruta `id`, Query Param `idComunidad`.
* **Output:**
```json
{
  "personaId": 1,
  "comunidadId": 2,
  "tieneOperacionesAbiertas": false,
  "operacionesAbiertas": [],
  "totalCerradas": 8
}

```


* **Códigos de Estado HTTP:**
* `200 OK`: Consulta exitosa.
* `400 Bad Request`: Si falta el parámetro `idComunidad`.


* **Debe:**
* Evaluar si la persona tiene operaciones en estado `ABIERTA` dentro de esa comunidad (por ejemplo, si tiene en su poder un libro prestado pendiente de devolución).


* Si `tieneOperacionesAbiertas === false`, el Servicio III autoriza la desvinculación de la comunidad.





---

### 6. Listar Historial de Operaciones

* **Ruta:** `GET /operaciones`
* **Query Params Opcionales:** `ejemplarId`, `personaId`, `tipo`, `estado`.
* **Output:**
```json
[
  {
    "id": 1,
    "tipo": "PRESTAMO",
    "ejemplarId": 10,
    "comunidadId": 2,
    "personaOrigenId": 1,
    "personaDestinoId": 4,
    "fechaInicio": "2026-09-20T10:00:00Z",
    "estado": "ABIERTA"
  }
]

```


* **Códigos de Estado HTTP:**
* `200 OK`: Listado devuelto correctamente.



---

### 7. Consultar Operación por ID

* **Ruta:** `GET /operaciones/:id`
* **Input:** Parámetro de ruta `id`.
* **Output:** Objeto con el detalle completo de la operación.
* **Códigos de Estado HTTP:**
* `200 OK`: Operación encontrada.
* `404 Not Found`: ID no registrado.



---

## Casos Bordes Contemplados

1. **Intento de préstamo por quien no posee el libro:** Aunque el usuario sea el dueño registrado del ejemplar, si el libro se encuentra prestado a otra persona, el dueño no puede efectuar un préstamo. Retorna `409 Conflict`.


2. **Préstamos encadenados legítimos:** Si la persona A presta a B, y luego B le presta a C sin haber devuelto a A, el sistema lo permite siempre que B tenga la posesión actual, cerrando el tramo A $\rightarrow$ B y abriendo el tramo B $\rightarrow$ C manteniendo la propiedad en A.


3. **Cesión sin posesión física:** El dueño legítimo puede transferir la propiedad a otro miembro de la comunidad en cualquier momento, aun cuando el libro esté físicamente en manos de un tercero por un préstamo vigente. Retorna `201 Created`.


4. **Cesión por parte de un no-propietario:** Si un usuario que tiene el libro prestado intenta ceder la propiedad a un tercero, el sistema lo rechaza inmediatamente con `409 Conflict`.


5. **Operaciones sobre ejemplar dado de baja:** Cualquier intento de préstamo, devolución o cesión sobre un ejemplar en estado de baja es rechazado con `409 Conflict`.


6. **Baja con préstamo activo:** No se puede dar de baja un ejemplar mientras una persona lo tenga en calidad de préstamo abierto. Retorna `409 Conflict`.


7. **Operación entre distintas comunidades:** Si la persona origen y la persona destino no comparten la comunidad indicada en la petición, la operación se rechaza con `400 Bad Request`.


8. **Devolución de ejemplar no prestado:** Si se intenta registrar una devolución sobre un ejemplar que no tiene ninguna operación de préstamo abierta, se responde `409 Conflict`.


9. **Formateo de campos sin valor:** Cualquier campo opcional sin dato en las consultas individuales se responde como `"Sin Valor"`.


10. **Baja de usuario con préstamo activo:** No se podrá dar de baja a un usuario en caso de que tenga un prestamo en curso (abierto).

11. **Baja de usuario**: La persona no podrá ser dada de baja de una comunidad hasta que todas sus operaciones esten cerradas y/o operaciones relacionadas con él (por ejemplo, si se presta un ejemplar a alguien y este lo presta a otra persona).
    

*/