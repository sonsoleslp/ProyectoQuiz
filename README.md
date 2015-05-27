![alt text][logo]  
![alt text][firma] 

----
### Descripción del proyecto

Proyecto desarrollado para la asignatura de Computación en Red de 3º curso de *Grado en Ingeniería de Servicios y Sistemas de Telecomunicaciones* de la UPM.

El proyecto consiste en una aplicación web, que emplea *node.js* para la capa de servidor; *HTML*, *CSS* y *JS* para el front-end, y base de datos *SQLite*.

El *Quiz* contiene varias secciones

  - **Página principal**: Página de bienvenida a la aplicación
  - **Preguntas**: Contiene un listado de todas las preguntas.
  - **Mis preguntas**: Contiene un listado de todas las preguntas creadas por el usuario.
  - **Favoritos**:  Contiene un listado de todas las preguntas que el usuario ha marcado como favoritas.
  - **Estadísticas**: Presenta estadísticas sobre el número de preguntas y comentarios
  - **Usuarios**: Contiene un listado de usuarios y acceso a su perfil.
  - **Créditos**: Perfil de la autora.

Las preguntas se pueden modificar y/o eliminar si se es propietario de ellas, pero cualquiera puede marcarlas como favoritas. También se pueden agregar fotos, comentarios y crear preguntas nuevas. 

Cada usuario tiene un perfil, accesible desde el listado de usuarios, con una foto personalizable y una descripción del usuario.


### Instalación

```sh
$ git clone https://github.com/sonsoleslp/ProyectoQuiz
$ cd ProyectoQuiz
$ npm install
$ foreman start
```




### Recursos
+ [node.js] Programación back-end
+ [express] Servidor
+ [google-fonts]: Fuentes de la página
+ [google-charts]: Estadísticas



[node.js]:http://nodejs.org
[google-charts]:https://developers.google.com/chart/
[google-fonts]: https://www.google.com/fonts
[jQuery]:http://jquery.com
[express]:http://expressjs.com

[logo]: http://sonsoleslp.neocities.org/OTHER.png
[firma]:http://sonsoleslp.neocities.org/FIR.png
