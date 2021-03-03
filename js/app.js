const result = document.getElementById('resultado')
const form = document.getElementById('formulario')
const divPagination = document.getElementById('paginacion')

const registersPerPage = 40;
let totalPages;
let iterator;
let pageActual = 1;
let findTerm;

window.onload = () =>{
    form.addEventListener('submit', validateForm)
}

function validateForm(e){
    e.preventDefault()

    findTerm = document.getElementById('termino').value;

    if(findTerm == ''){
        showMessage('Agrega palabras para encontrar imágenes!.')
        return;
    }

    findTerm = findTerm.replace(/ /g,"+");
    console.log(findTerm);

    findItems(findTerm)
}


function showMessage(message){

    const alertExist = document.querySelector('.bg-red-100');

    if(!alertExist){
        const alert = document.createElement('p');
        alert.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center')

        alert.innerHTML =`
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${message}</span>
        `;

        form.appendChild(alert);

        setTimeout(()=>{
            alert.remove()
        },3000)
     }
}

function findItems(term){
    url = `https://api.mercadolibre.com/sites/MLA/search?q=${term}&offset=${pageActual}`;
    
    fetch(url)
        .then(answer => answer.json())
        .then(result => {
             console.log(result);
            
            totalPages = calculatePages(result.paging.total, result.paging.limit);
            showItems(result.results)
            
        })
}

function *createPaginator(total){
    for(let i = 1; i<=total; i++){
        yield(i);
    }
}

function calculatePages(total, limit){
    return parseInt((Math.ceil(total/limit)));
}

function showItems(items){
    
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }

    items.forEach(item =>{
        const {title,price,permalink,id,thumbnail} = item;

        result.innerHTML+=`
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${thumbnail}">

                    <div class="p-4">
                        <p class="font-bold">${title}</p>
                        <p class="font-light">Precio: <span class="font-bold">$${price}</span></p>

                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${permalink}" target="_blank" rel="noopener noreferrer">
                        Ver publicación
                        </a>
                    </div>
                </div>
            </div>
        `;
    })

    printPaginator()
    
}

function printPaginator(){
    iterator = createPaginator(totalPages);

    while(divPagination.firstChild){
        divPagination.removeChild(divPagination.firstChild);
    }

    while(true){

        const {value, done} = iterator.next();
        if(done) return;

        const button = document.createElement('a');
        button.href = '#';
        button.dataset.page = value;
        button.textContent = value;
        button.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-10','rounded')

        button.onclick = () =>{
            pageActual = pageActual+50;
            findItems(findTerm);
        }

        divPagination.appendChild(button);
    }
}
