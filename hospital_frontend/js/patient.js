const blood = document.getElementById('blood_type')
const ehr = document.getElementById('ehr')
const employees = document.getElementById('employees')
const departments = document.getElementById('departments')
const description = document.getElementById('description')
const dep_rooms = document.getElementById('departments-room')
const rooms = document.getElementById('rooms')
const medications = document.getElementById('medications')
const quantity = document.getElementById('quantity')
const date = document.getElementById('date')
const hospital = document.getElementById('hospital')
const total = document.getElementById('total')
const url = 'http://localhost/hospital/hospital_backend'
const jwt = localStorage.getItem('jwt')
let department_id = 1
let doc = new jsPDF();

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
            dep_rooms.innerHTML += `<option value='${dep.id}'>${dep.name}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_rooms.php?dep_id=${department_id}`
      }).then((result) => {
        result.data.forEach((room) => {
            rooms.innerHTML += `<option value='${room.id}'>${room.room_number}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_medications.php`
      }).then((result) => {
        result.data.forEach((med) => {
            medications.innerHTML += `<option value='${med.id}'>${med.name} , $${med.cost}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });

      axios({
        "method": "get",
        "url": `${url}/get_invoice.php`,
        headers: {
            'Authorization': jwt,
          },
      }).then((result) => {
        let h_name = result.data[0].name
        let invoice_total = result.data[0].total_amount
        let date_issued = result.data[0].date_issued
        hospital.innerHTML = 'Hospital: ' + h_name
        total.innerHTML = 'Total: ' + invoice_total
        date.innerHTML = 'Date Issued: ' + date_issued

        doc.text(`Hospital: ${h_name}, Total: ${invoice_total}, Date Issued: ${date_issued}`, 10, 10);

      }).catch((err) => {
        console.error(err)
      });
}

dep_rooms.addEventListener('change', () => {
    department_id = dep_rooms.value
    rooms.innerHTML = ''
    axios({
        "method": "get",
        "url": `${url}/get_rooms.php?dep_id=${department_id}`
      }).then((result) => {
        result.data.forEach((room) => {
            rooms.innerHTML += `<option value='${room.id}'>${room.room_number}</option>`
        })
      }).catch((err) => {
        console.error(err)
      });
})

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
        alert('info updated!')
      }).catch((err) => {
        console.error(err)
      });
}

function requestService() {
    let data = new FormData();
        data.append('employee', employees.value)
        data.append('description', description.value)
        data.append('department', departments.value)
    axios({
        "method": "post",
        "url": `${url}/request_service.php`,
        headers: {
            'Authorization': jwt,
          },
          'data': data
      }).then((result) => {
        alert('request sent!')
      }).catch((err) => {
        console.error(err)
      });
}

function chooseRoom() {
    let data = new FormData();
        data.append('room', rooms.value)
        data.append('department', dep_rooms.value)
    axios({
        "method": "post",
        "url": `${url}/add_room.php`,
        headers: {
            'Authorization': jwt,
          },
          'data': data
      }).then((result) => {
        alert('room assigned!')
      }).catch((err) => {
        console.error(err)
      });
}

function chooseMeds() {
    let data = new FormData();
        data.append('med', medications.value)
        data.append('quantity', quantity.value)
    axios({
        "method": "post",
        "url": `${url}/add_meds.php`,
        headers: {
            'Authorization': jwt,
          },
          'data': data
      }).then((result) => {
        alert('med added!')
      }).catch((err) => {
        console.error(err)
      });
}

function downloadPDF() {
    doc.save('Invoice.pdf');
}