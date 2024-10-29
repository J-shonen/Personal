const inquirer = require('inquirer').default;
const fs = require('fs');
const archivo = 'listas.json';

//Primero los arrays
let listas = {
       Bleach: [],
       Made_in_Abyss: []
};

function guardarListas(){
       fs.writeFileSync(archivo, JSON.stringify(listas, null, 2));
       console.log('Listas guardadas en listas.json');
}

function cargarListas() {
       if (fs.existsSync(archivo)) {
         const data = fs.readFileSync(archivo, 'utf8');
         listas = JSON.parse(data);
         console.log('Listas cargadas desde listas.json');
       } else {
         console.log('No se encontró el archivo listas.json, se creará uno nuevo.');
       }
     }

     function Agregar_Tomo(lista, elemento) {
      // Verificar si la lista existe
      if (!listas[lista]) {
        console.log(`La lista "${lista}" no existe.`);

        return mostrarMenu(); // Volver al menú si la lista no existe
      }
    
      // Agregar el elemento a la lista existente
      listas[lista].push(elemento);
      guardarListas();
      console.log(`"${elemento}" agregado a la  lista "${lista}".`);

      mostrarMenu(); // Volver al menú después de agregar
    }
    

function mostrarElementos(lista){
       console.log(`Tomos:`, listas[lista].length > 0 ? listas[lista] : "La lista está vacía.");
}

function QuitarTomosMenu() {
  // Primero seleccionamos la lista de la que queremos descontar
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'lista',
        message: '¿De qué lista quieres quitar un tomo?',
        choices: Object.keys(listas),  // Mostrar todas las listas
      },
    ])
    .then((respuesta) => {
      const listaSeleccionada = respuesta.lista;

      // Verificar si la lista tiene elementos
      if (listas[listaSeleccionada].length === 0) {
        console.log(`La lista "${listaSeleccionada}" está vacía, no hay tomos para descontar.`);
        return mostrarMenu();
      }

      // Si la lista tiene elementos, permitir al usuario seleccionar uno
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'elemento',
            message: 'Selecciona el tomo que deseas quitar:',
            choices: listas[listaSeleccionada],  // Mostrar elementos de la lista seleccionada
          },
        ])
        .then((respuesta) => {
          const elementoAEliminar = respuesta.elemento;
          QuitarTomos(listaSeleccionada, elementoAEliminar);
        });
    });
}

function mostrarTodasLasListas() {
       console.log("Todas las listas:");
       for (let lista in listas) {
         console.log(`${lista}:`, listas[lista].length > 0 ? listas[lista] : "La lista está vacía.");
       }
       mostrarMenu();
     }

function mostrarMenu() {
       inquirer
         .prompt([
           {
             type: 'list',
             name: 'opcion',
             message: 'Selecciona una opción:',
             choices: [
               'Agregar tomo a una lista',
               'Mostrar tomos de una lista',
               'Agregar Lista',
               'Quitar Lista',
               'Mostrar todas las listas',
               'Quitar tomos de una lista',
               'Salir',
             ],
           },
         ])
         .then((respuesta) => {
           switch (respuesta.opcion) {
             case 'Agregar tomo a una lista':
               agregarTomoMenu();
               break;
             case 'Mostrar tomos de una lista':
               mostrarElementosMenu();
               break;
             case 'Mostrar todas las listas':
               mostrarTodasLasListas();
               break;
               case 'Quitar tomos de una lista':
                QuitarTomosMenu();
                break;
                case 'Agregar Lista':
                AgregarNuevaLista();
                break;
                case 'Quitar Lista':
                  QuitarListas();
                  break;
             case 'Salir':
               console.log('¡Adiós! :v');
               break;
               
           }
         });
     }

     function agregarTomoMenu() {
       inquirer
       .prompt([
       {
       type: 'list',
       name: 'lista',
       message: '¿A qué lista quieres agregar el elemento?',
       choices: Object.keys(listas),
     },
     {
       type: 'input',
       name: 'elemento',
       message: '¿Qué elemento quieres agregar?',
     },
     ])
     .then((respuesta) => {
       Agregar_Tomo(respuesta.lista, respuesta.elemento);
     });
}

function mostrarElementosMenu(){
  inquirer
  .prompt([
    {
      type: 'list',
      name: 'lista',
      message: '¿Qué lista quieres mostrar?',
      choices: Object.keys(listas),
    },
  ])
  .then((respuesta)=>{
    mostrarElementos(respuesta.lista);
   mostrarMenu();
  });
}

function AgregarNuevaLista(){
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'nombreLista',
      message: 'Escribe el nombre de la nueva Lista',
    }
  ])
  .then((respuesta)=>{
    const NuevaLista = respuesta.nombreLista.trim();
    
    if(listas[NuevaLista]) {
      console.log(`La lista "${NuevaLista}" ya existe.`);
      return mostrarMenu();
    }
    listas[NuevaLista] = [];
    guardarListas();
    console.log(`La lista "${NuevaLista}" ha sido creada.`);
    
    mostrarMenu();
  });
}

function QuitarTomos(lista, elemento) {
  // Buscar y eliminar el elemento de la lista
  const indice = listas[lista].indexOf(elemento);
  if (indice > -1) {
    listas[lista].splice(indice, 1);  // Elimina el elemento
    guardarListas();  
    console.log(`"${elemento}" descontado de la lista "${lista}".`);
  } else {
    console.log(`El "${elemento}" no se encontró en la lista "${lista}".`);
  }
  mostrarMenu();  
}

function QuitarListas(){
  inquirer
  .prompt([
    {
    type: 'list',
    name: 'lista',
    message: '¿Qué lista deseas eliminar?',
    choices: Object.keys(listas),
    },
  ])
  .then((respuesta)=>{
    const listaSeleccionada = respuesta.lista;

    if(listas[listaSeleccionada] !== undefined) {
      delete listas[listaSeleccionada];
      guardarListas();
      console.log(`La lista "${listaSeleccionada}" ha sido eliminada.`);
    }else{
      console.log(`La lista "${listaSeleccionada}" no existe, desea crear una nueva lista?`);
    }
    mostrarMenu();
  });
}



cargarListas();
mostrarMenu();
