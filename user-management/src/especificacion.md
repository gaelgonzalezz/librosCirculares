#Contexo General

    Estamos en un entorno de desarrollo (repositorio) multiproyecto, en nestjs con typescript, orientada en distintas capas, pero no hay persistencia en una base de datos, es todo en memoria, utilizando API REST.

    Bajo el nombre de "Libros Circulares", debemos simular el proceso del siguiente proceso sabiendo el siguiente contexto:
    Una organización social destinada a impulsar la lectura en la población ha decidido iniciar
    un proyecto de circulación de libros. En este marco, se propone el diseño y desarrollo de
    un sistema para facilitar el proceso de préstamos de libros, devoluciones y cesiones.
    Se promueve el préstamo de libros a otras personas, incluso sin necesidad de volver a su
    dueño original y sin que ese dueño original pierda la propiedad. Esto significa que si una
    persona A presta un libro a B, B lo puede prestar a C, C a D, sin embargo, la propiedad continúa siendo de A hasta que él decida otorgársela a otro. En realidad, el objeto de operaciones es un ejemplar de una edición de una obra. Las operaciones permitidas son el préstamo, devolución, la cesión de la propiedad y la baja del ejemplar.

    El repositorio aglomera 3 servicios los cuales interactuan y consumen recursos entre si de manera simultanea.
    los 3 servicios son:

    1. copy-management:
        Es el servicio central de datos de los libros. Tal como se mencionó anteriormente, el objeto de operaciones es un ejemplar de una edición de una obra.
        Debemos llevar registro de la obra con su nombre (título), género de la obra (ciencia ficción, documental, novela, etc.) y sus autores (nombre, apellido, nacionalidad y país de residencia).
        Una obra (por ejemplo “Rayuela”, de Julio Cortazar) puede tener diversas ediciones (1963 por editorial A, 2023 por editorial Z). Se debe llevar registro de cada edición: esa obra editada por determinada editorial en determinado año.
        Finalmente, el ejemplar corresponde a lo que efectivamente leemos, lo que podríamos entender como libro físico. Ese ejemplar es el objeto de los préstamos y de la propiedad. Se debe registrar el dueño actual del ejemplar y quién lo tiene actualmente.

    2. operation-management:
        Las operaciones permitidas son el préstamo, devolución, la cesión de la propiedad y la baja del ejemplar.
        El préstamo implica que una persona que tenía en su poder el libro lo cede temporalmente a otra. Sólo puede realizar el préstamo si lo tiene actualmente en su poder. Incluso si es el propietario no podrá prestarlo si no lo tiene en su poder.La devolución es el vencimiento del préstamo sin que se haya producido un nuevo préstamo por lo cual el libro es retornado a su propietario.
        La cesión de la propiedad es el cambio de propietario y sólo puede ser realizado por el propietario. Para realizar la cesión no es necesario tenerlo en su poder y puede realizarlo en cualquier momento a cualquier usuario.
        La baja del ejemplar implica que un ejemplar ya no está disponible para participar en el circuito de circulación de libros y sobre él no se podrá realizar ninguna operación.

    3. user-management:
        Todas las operaciones de libros solo podrán ser realizadas dentro de personas de una comunidad. Una comunidad es un conjunto de personas entre las cuales es posible realizar las operaciones indicadas. Cada persona puede estar asociada a diversas comunidades. Las comunidades son creadas por el administrador central del Sistema directamente en la base de datos.
        Las personas solo pueden estar activas en tres comunidades. Para poder participar en una cuarta tiene que ser inactivada en otra. Para ser inactivada en una comunidad deben tener todas las operaciones cerradas.
        Para ello, toda persona que desee utilizar el Sistema deberá registrarse, almacenando información básica como nombre, apellido y número de documento. El proceso de registro deberá incluir una validación de identidad. Si bien originalmente se pensó que un usuario para registrarse deba tener un email único, esto no es conveniente dado que pueden participar menores o personas que no tengan acceso a un correo electrónico. Sin embargo, tener información de los medios de comunicación es fundamental para el envío de notificaciones, por ello toda persona debe tener un email o teléfono asociado, ya sea propio o de un tercero al cual le llegará la información (por ejemplo, menores asocian los datos de contacto de su madre o padre). Esto no significa que en el modelo las personas pueden tener email repetido, sino que pueden vincularse diferentes personas a otra persona que será el sujeto de contacto.

    4. recomendation-management
        A partir del historial de préstamos de una persona, genera nuevas recomendaciones. Para ello se integra con un sistema externo denominado BookIA al cual se le envía el historial reciente y retorna una lista de libros recomendados. Sobre los libros recomendados por dicha herramienta se verifica cuáles están disponibles en la comunidad y se seleccionan para recomendar a la persona.

#Restricciones tecnicas

    Estamos en un entorno de desarrollo (repositorio) multiproyecto programado en TypeScript, en node 24.21.0 y nestjs 11.19.0, orientada en distintas capas, pero no hay persistencia en una base de datos, es todo en memoria, utilizando API REST. NO generes test, es innecesario, no escribas nada, todavía no es un requerimento del proyecto. Tenemos una lista en los services, es lo que usamos para la persistencia, es innecesario bbbd o /domains.

#Contexto General de este Servicio

    Sabiendo que vamos a trabajar en el servicio 3 (user-management):
        Las personas solo pueden estar activas en tres comunidades. Para poder participar en una cuarta tiene que ser inactivada en otra. Para ser inactivada en una comunidad deben tener todas las operaciones cerradas.
        Para ello, toda persona que desee utilizar el Sistema deberá registrarse, almacenando información básica como nombre, apellido y número de documento. El proceso de registro deberá incluir una validación de identidad. Si bien originalmente se pensó que un usuario para registrarse deba tener un email único, esto no es conveniente dado que pueden participar menores o personas que no tengan acceso a un correo electrónico. Sin embargo, tener información de los medios de comunicación es fundamental para el envío de notificaciones, por ello toda persona debe tener un email o teléfono asociado, ya sea propio o de un tercero al cual le llegará la información (por ejemplo, menores asocian los datos de contacto de su madre o padre). Esto no significa que en el modelo las personas pueden tener email repetido, sino que pueden vincularse diferentes personas a otra persona que será el sujeto de contacto.

    Necesito las siguientes funcionalidades de API REST: post, get, patch y delete.

    Una persona puede tener un representante (por ejemplo, en el caso de que sea menor de edad), en ese caso, el medio de contacto de persona 1(la que tiene representante) será rellenada con los medios de contacto de la persona 2(la que representa a la persona 1).
    Cuando hacemos actualizaciones, solo se actualizan los datos entrantes, no todo el dato (es decir, llega un nombre para actualizar y SOLO se cambia el nombre y el resto permanece igual).
    Necesito los endpoints con persona y comunidad (necesito que se le puedan hacer las operaciones de api rest).
    A persona se le pueden hacer las 4 operaciones. Cuando se crea una persona debe venir con su(s) medio(s) de contacto.
    A comunidad puede hacerse las 4 también.

    CASOS DE USO - Restricciones - Limites:
    A la comunidad se la crea primero sin personas, pero se debe permitir asignarselas posterior a su creación.
    Al eliminar una comunidad, se debe dar de baja todas las personas afilidadas.
    No puede haber comunidades con mismo nombre, en caso de que esto pase, solicitar nombre distinto.
    Una persona solo puede participar en hasta 3 comunidades de manera activa. Para estar asociada a una cuarta, debe estar inactiva(proximo a dar de baja) en alguna comunidad de las 3 que estaba.
    Para que una persona sea desactivada de una comunidad, debe tener todas las operaciones cerradas, es decir, préstamo, devolución, la cesión de la propiedad y la baja del ejemplar. Deben estar todas completadas satisfactoriamente para proceder con la baja, es decir, ninguna en proceso. Para saberlo debemos tener un getpost a /persona (que vive en el otro servicio, operation-management) y le mandamos el id de la persona que deseamos dar de baja; vamos a tener un endpoint al otro servicio el cual devuelva si tiene todas las operaciones cerradas o no, con lo que nos permitira hacer la condicion de dar de baja (si devuelve true) o no (si devuelve false) el ejemlo es: get a /persona/idPersona/1/operacionesCerradas?idComunidad=2. 
    Dos id's no pueden ser iguales (dentro de la misma entidad), se asignará el número disponible mas cercano (si hay id´s 1, 2 y 3, se asigna 4).


#Especificacion de este servicio
    ##Entidades a modelar
        Persona tiene los siguientes atributos:
        class persona{
            nombre
            apellido
            dni
            personaContacto
            listaMedioContactos
        }

        Comunidad:
        class comunidad{
            nombre
            personas[]
        }

        MedioContacto:
        class medioContacto{
            tipo
            valor
            esPreferido 
        }

    ##Operaciones permitidas-flujos
        Creación de persona.
        Eliminación de persona.
        Modificación de algún atributo de la persona.
        La persona puede tener un representante.
        Creacion, modificación y eliminacion de medios de contacto de una persona (MedioContacto).        
        Creación de comunidad.
        Modificación de comunidad.
        Alta de persona en comunidad.
        Baja de persona en comunidad.

    ##Casos border
        Se puede modificar la persona que esta a cargo (representante/responsable).
        Se rechaza el ingreso de una nueva persona si el DNI coincide con alguno ya existente.
        Se rechaza la carga de un metodo de contacto si coincide con alguno ya existente y NO es el de un responsable.
        La persona no puede estar en más de 3 comunidades de manera activa (definimos activa como operaciones en curso), si no está activa, al momento de afiliarse a la nueva comunidad se lo considera activo automáticamente, y en la comunidad que esta inactivo se lo da de baja automáticamente.