
const table = document.querySelector('table')
const yesterday = document.querySelector('.yesterday-log')
const getLogDetailByDateBtn=document.querySelectorAll('input')

let string = `
<tr class='table-head'>
    <th>
        NAME
    </th>
    <th>
        DATE
    </th>
    <th>
        IN
    </th>
    <th>
        OUT
    </th>
</tr>


`
fetch('/admin/entries/today')
    .then(response => response.json())
    .then(data => {
        populateLogDOM(data)
    })

getLogDetailByDateBtn[1].addEventListener('click',(e)=>{
    getLogDetailByDate(getLogDetailByDateBtn[0].value)
})
function getYesterdayLog() {
    yesterday.innerHTML = ''
    fetch('/admin/entries/yesterday')
        .then(response => response.json())
        .then(data => {
            populateLogDOM(data)
        })
}

function populateLogDOM(data) {
    string = ''
    string = `
<tr class='table-head'>
    <th>
        NAME
    </th>
    <th>
        DATE
    </th>
    <th>
        IN
    </th>
    <th>
        OUT
    </th>
</tr>


`
    data.forEach(user => {
        if (user.Login===user.Out) {
            string += `
                <tr>
            <td class="user-name">${user.Name.toUpperCase()}</td>
            <td class="date-today">${new Date(user.Login).toDateString()}</td>
            <td class="in-time">${new Date(user.Login).toLocaleTimeString().toUpperCase()}</td>
            
            <td class="out-time">- - -Bit Lazy- - -</td>
            </tr>`
        }
        else {
            string += `
                <tr>
            <td class="user-name">${user.Name.toUpperCase()}</td>
            <td class="date-today">${new Date(user.Login).toDateString()}</td>
            <td class="in-time">${new Date(user.Login).toLocaleTimeString().toUpperCase()}</td>
            
            <td class="out-time">${new Date(user.Out).toLocaleTimeString().toUpperCase()}</td>
            </tr>`
        }
        // string += `<div><p class='line'><strong>Name: </strong>${user.Name}<br><br><strong>Time: </strong>${new Date(user.Login)}</p></div>`

    });

    table.innerHTML = ''
    table.innerHTML = string
}

function getLogDetailByDate(logDate) {
    fetch(`/admin/entries/${logDate}`)
    .then(response=>response.json())
    .then(data=>{
        populateLogDOM(data)
    })
}