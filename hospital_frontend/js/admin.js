const denied = document.getElementById('denied')
const container = document.getElementById('container')
const patients_select = document.getElementById('users')
const hospitals_select = document.getElementById('hospitals')
const patients_table = document.getElementById('patients-hospitals')
const gender_table = document.getElementById('gender-employees')
const hospitals_table = document.getElementById('patients-per-hospital')
const services = document.getElementById('services')
const employees_select = document.getElementById('employees-select')
const hospitals = document.getElementById('hospitals-select')
const url = 'http://localhost/hospital/hospital_backend'
const jwt = localStorage.getItem('jwt')


checkLogin()
getData()

console.log(jwt)
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
            if(result.data.type != 'admin') {
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
        "method": "get",
        "url": `${url}/get_patients.php`
      }).then((result) => {
        result.data.forEach((patient) => {
            patients_select.innerHTML += `<option value='${patient.id}'>${patient.name}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_hospitals.php`
      }).then((result) => {
        result.data.forEach((hosp) => {
            hospitals_select.innerHTML += `<option value='${hosp.id}'>${hosp.name}</option>`
            hospitals.innerHTML += `<option value='${hosp.id}'>${hosp.name}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_employees.php`
      }).then((result) => {
        result.data.forEach((emp) => {
            employees_select.innerHTML += `<option value='${emp.id}'>${emp.name}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_hospital_users.php`
      }).then((result) => {
        result.data.forEach((entry) => {
            patients_table.innerHTML += `<tr>
            <td>${entry.user_name}</td>
            <td>${entry.name}</td>
            <td>${entry.date_joined}</td>
            <td>${entry.date_left}</td>
            </tr>`
        })
      }).catch((err) => {
        console.error(err)
      });

      
      axios({
        "method": "get",
        "url": `${url}/get_stats.php`
      }).then((result) => {
        console.log(result)
        gender_table.innerHTML += `
        <tr><td>${result.data.count_males}</td><td>${result.data.count_females}</td>`
        result.data.hospitals.forEach((hosp)=> {
            hospitals_table.innerHTML += `<tr><td>${hosp.name}</td><td>${hosp.entry_count}</td>`
        })
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
            <td>${(service.approved == 0) ? `<button onclick="approveService(${service.id})">Approve</button>` : 'Approved'}</td>
            </tr>`
        })
      }).catch((err) => {
        console.error(err)
      });
}

function approveService(id) {
    let data = new FormData();
        data.append('id', id)
    axios({
        "method": "post",
        "url": `${url}/approve_service.php`,
        headers: {
            'Authorization': jwt,
          },
        'data': data
      }).then((result) => {
        alert('approved!')
      }).catch((err) => {
        console.error(err)
      });
}
function assignPatient() {
    let assign_data = new FormData();
        assign_data.append('patient_id', patients_select.value)
        assign_data.append('hospital_id', hospitals_select.value)
    axios({
        "method": "post",
        "url": `${url}/assign_patient.php`,
        headers: {
            'Authorization': jwt,
          },
        "data": assign_data
      }).then((result) => {
        alert('patient assigned!')
      }).catch((err) => {
        console.error(err)
      });
}

function assignEmployee() {
    let assign_data = new FormData();
        assign_data.append('employee_id', employees_select.value)
        assign_data.append('hospital_id', hospitals.value)
    axios({
        "method": "post",
        "url": `${url}/assign_employee.php`,
        headers: {
            'Authorization': jwt,
          },
        "data": assign_data
      }).then((result) => {
        alert('employee assigned!')
      }).catch((err) => {
        console.error(err)
      });
}