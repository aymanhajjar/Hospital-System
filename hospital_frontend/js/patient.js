const blood = document.getElementById('blood_type')
const ehr = document.getElementById('ehr')
const employees = document.getElementById('employees')
const departments = document.getElementById('departments')
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
            if(result.data.type != 'patient') {
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
        "url": `${url}/get_patient_info.php`,
        headers: {
            'Authorization': jwt,
          }
      }).then((result) => {
        console.log(result)
        blood.value = result.data[0].blood_type
        ehr.value = result.data[0].EHR
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_employees.php`
      }).then((result) => {
        result.data.forEach((emp) => {
            employees.innerHTML += `<option value='${emp.id}'>${emp.name}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_departments.php`
      }).then((result) => {
        result.data.forEach((dep) => {
            departments.innerHTML += `<option value='${dep.id}'>${dep.name}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });
}

function updateInfo() {
    let data = new FormData();
        data.append('blood_type', blood.value)
        data.append('ehr', ehr.value)
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