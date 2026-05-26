const toggleBtn =
document.getElementById('toggleBtn')

const sidebar =
document.getElementById('sidebar')

toggleBtn.addEventListener('click', () => {

    sidebar.classList.toggle('closed')

    localStorage.setItem(
        'sidebar',
        sidebar.classList.contains('closed')
    )

})

window.addEventListener('load', () => {

    const sidebarState =
    localStorage.getItem('sidebar')

    if(sidebarState === 'true'){

        sidebar.classList.add('closed')

    }

})

const entradas = 128400
const saidas = 76900

const lucro = entradas - saidas

const lucroElement =
document.getElementById('lucro')

const entradaElement =
document.getElementById('entradaValor')

const saidaElement =
document.getElementById('saidaValor')

entradaElement.innerText =
`R$ ${entradas.toLocaleString('pt-BR')}`

saidaElement.innerText =
`R$ ${saidas.toLocaleString('pt-BR')}`

lucroElement.innerText =
`R$ ${lucro.toLocaleString('pt-BR')}`

if(lucro >= 0){

    lucroElement.classList.add('positive')

}else{

    lucroElement.classList.add('negative')

}

const movimentacoes = [

    {
        descricao:'Pagamento fornecedor',
        tipo:'Saída',
        valor:4200
    },

    {
        descricao:'Recebimento cliente',
        tipo:'Entrada',
        valor:12500
    },

    {
        descricao:'Conta de energia',
        tipo:'Saída',
        valor:890
    },

    {
        descricao:'Mensalidade cliente',
        tipo:'Entrada',
        valor:6800
    }

]

const tableBody =
document.getElementById('tableBody')

movimentacoes.forEach(item => {

    const tr =
    document.createElement('tr')

    const valorClass =
    item.tipo === 'Entrada'
    ? 'positive'
    : 'negative'

    tr.innerHTML = `

        <td>${item.descricao}</td>

        <td class="${valorClass}">
            ${item.tipo}
        </td>

        <td class="${valorClass}">
            R$ ${item.valor.toLocaleString('pt-BR')}
        </td>

    `

    tableBody.appendChild(tr)

})

const cards =
document.querySelectorAll('.card')

cards.forEach(card => {

    card.addEventListener('mouseenter', () => {

        card.style.transform =
        'translateY(-8px) scale(1.01)'

    })

    card.addEventListener('mouseleave', () => {

        card.style.transform =
        'translateY(0px) scale(1)'

    })

})

const currentDate =
new Date()

const monthNames = [

    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'

]

const currentMonth =
monthNames[currentDate.getMonth()]

const currentYear =
currentDate.getFullYear()

const monthSelect =
document.getElementById('monthSelect')

const yearSelect =
document.getElementById('yearSelect')

if(monthSelect){

    monthSelect.value =
    currentMonth

}

if(yearSelect){

    yearSelect.value =
    currentYear

}