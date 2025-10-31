# Sistema de BookShop con Next.js con TypeScript, MongoDB y Cloudinary

BookShop es una libreria en línea para gestionar libros y todo un Crud, con Next.js y MongoDB.
Permite gestionar libros con portada, descripción y relación con editoriales.
Incluye listado con búsqueda, detalle con vistas/likes y edición con subida de imagen.
Usa componentes de servidor para el fetching y componentes de cliente para UX reactiva.
Muestra estados de carga globales y por segmento, y toasts de éxito tras crear un libro.
La persistencia se realiza con Mongoose + Typegoose; las imágenes van a Cloudinary.
El diseño utiliza utilidades CSS y iconos de Lucide para una UI limpia.

![CRUD Biblioteca Next.js con TypeScript y MongoDB](https://raw.githubusercontent.com/urian121/imagenes-proyectos-github/refs/heads/master/crud-full-stack-sistema-de-libreria-con-nextjs-ts-mongodb.gif)

## Características

- CRUD de libros con portada en Cloudinary y conteo de vistas/likes.
- Búsqueda por título/autor, detalle con editorial y edición con select preseleccionado.
- Estados de carga: global y por ruta (books/new), y navegación con PendingLink.
- Toast de éxito al crear libros usando nextjs-toast-notify sin convertir la Page en cliente.

## Tecnologías usadas

- Next.js (App Router), React Server/Client Components, TypeScript.
- MongoDB, Mongoose y Typegoose, reflect-metadata.
- Cloudinary para media, lucide-react para iconos, nextjs-toast-notify para toasts.

## Dependencias de datos (organizado)

Instalación:

```bash
npm install mongoose @typegoose/typegoose reflect-metadata
```

- Mongoose → ODM para MongoDB; define modelos, esquemas y queries (p. ej. `await BookModel.find()`).
- Typegoose → Typegoose es una biblioteca que facilita el uso de Mongoose con TypeScript, proporcionando una capa sobre el módulo de Mongoose para interactuar con MongoDB.
Ejemplo con Typegoose:

```ts
import "reflect-metadata";
import { prop, getModelForClass } from "@typegoose/typegoose";

class Book {
  @prop({ required: true })
  title!: string;
}

export const BookModel = getModelForClass(Book);
```

Equivalente con Mongoose puro:

```ts
import { Schema, model } from "mongoose";
const BookSchema = new Schema({ title: String });
export const BookModel = model("Book", BookSchema);
```

- reflect-metadata → habilita decorators y tipos en runtime requeridos por Typegoose:

```ts
import "reflect-metadata";
```


## 🙌 Cómo puedes apoyar 📢:

✨ **Comparte este proyecto** con otros desarrolladores para que puedan beneficiarse 📢.

☕ **Invítame un café o una cerveza 🍺**:
   - [Paypal](https://www.paypal.me/iamdeveloper86) (`iamdeveloper86@gmail.com`).

### ⚡ ¡No olvides SUSCRIBIRTE a la [Comunidad WebDeveloper](https://www.youtube.com/WebDeveloperUrianViera?sub_confirmation=1)!


#### ⭐ **Déjanos una estrella en GitHub**:
   - Dicen que trae buena suerte 🍀.
**Gracias por tu apoyo 🤓.**
