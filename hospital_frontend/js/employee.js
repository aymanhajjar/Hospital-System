const ssn = document.getElementById('ssn')
const date_joined = document.getElementById('date-joined')
const position = document.getElementById('position')
const url = 'http://localhost/hospital/hospital_backend'
const jwt = localStorage.getItem('jwt')

checkLogin()
getData()

function logOut() {
    localStorage.removeItem('jwt')
    window.location.href = 'index.html'
}

function checkLogin() {
    if(jwt != null) {
        axios({
            "method": "post",
            "url": `${url}/check_login.php`,
            headers: {
                'Authorization': jwt,
              }
          }).then((result) => {
            console.log(result)
            if(result.data.type != 'employee') {
                denied.style.display = 'block'
                container.style.display = 'none'
            } else {
                denied.style.display = 'none'
                container.style.display = 'block'
            }
          }).catch((err) => {
            console.error(err)
          });
    }
}

function getData() {
    axios({
        "method": "post",
        "url": `${url}/get_employee_info.php`,
        headers: {
            'Authorization': jwt,
          }
      }).then((result) => {
        ssn.value = result.data[0].ssn
        date_joined.value = result.data[0].date_joined
        position.value = result.data[0].position
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_services.php`
      }).then((result) => {
        result.data.forEach((service) => {
            services.innerHTML += `<tr>
            <td>${service.patient}</td>
            <td>${service.employee}</td>
            <td>${service.description}</td>
            <td>${service.cost}</td>
            <td>${service.name}</td>
            <td>${(service.approved == 0) ? `Pending Approval` : 'Approved'}</td>
            </tr>`
        })
      }).catch((err) => {
        console.error(err)
      });
}

function updateInfo() {
    let data = new FormData();
        data.append('ssn', ssn.value)
        data.append('date_joined', date_joined.value)
        data.append('position', position.value)
    axios({
        "method": "post",
        "url": `${url}/update_employee_info.php`,
        headers: {
            'Authorization': jwt,
          },
          'data': data
      }).then((result) => {
        console.log(result)
      }).catch((err) => {
        console.error(err)
      });
}