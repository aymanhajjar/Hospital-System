const register_form = document.getElementById('registerPopup')
const login_form = document.getElementById('loginPopup')
const container = document.getElementById('container')
const patient_signup = document.getElementById('patient-signup')
const work_signup = document.getElementById('work-signup')
const admin_code = document.getElementById('admin-code')
const employee_code = document.getElementById('employee-code')
const ssn = document.getElementById('ssn')
const date_joined = document.getElementById('date-joined')
const work_position = document.getElementById('position')
const choose_work = document.getElementById('choose-work')
const admin_radio = document.getElementById('admin-radio')
const employee_radio = document.getElementById('employee-radio')
const full_name = document.getElementById('name')
const signup_email = document.getElementById('email-signup')
const signup_password = document.getElementById('password-signup')
const confirm_password = document.getElementById('confirmPassword')
const date_of_birth = document.getElementById('dob')
const male = document.getElementById('male')
const female = document.getElementById('female')
const submit_signup = document.getElementById('submit-signup')
const hospital = document.getElementById('hospital')
const error = document.getElementById('errormessage')
const login_button = document.getElementById('login-button')
const login_email = document.getElementById('email-login')
const login_password = document.getElementById('password-login')
const url = 'http://localhost/hospital/hospital_backend'
const jwt = localStorage.getItem('jwt')
let gender = 'male'
let password_validated = true
let employee = false
let work_type = 'employee'

console.log(jwt)
checkLogin()

function openForm() {
    register_form.classList.add('openForm')
    container.classList.add('containerBlur')
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
            console.log('loggedin')
            if(result.data.type == 'employee') {
                window.location.href="employee.html"
            } else if (result.data.type == 'patient') {
                window.location.href="patient.html"
            } else if (result.data.type == 'admin') {
                window.location.href="admin.html"
            }
          }).catch((err) => {
            console.error(err)
          });
    }
}

work_signup.addEventListener('click', () => {
    work_signup.classList.add('highlighted')
    patient_signup.classList.remove('highlighted')
    choose_work.classList.remove('hidden')
    employee_code.classList.remove('hidden')
    work_position.classList.remove('hidden')
    ssn.classList.remove('hidden')
    hospital.classList.remove('hidden')
    date_joined.classList.remove('hidden')
    employee = true

    axios({
        "method": "get",
        "url": `${url}/get_hospitals.php`
      }).then((result) => {
        console.log(result)
        hospital.innerHTML = ''
        if(result.data.length > 0) {
            result.data.forEach((h) => {
                console.log(h.name)
                hospital.innerHTML += `<option value="${h.name}">${h.name}</option>`
            })
        } else {
            hospital.innerHTML = `<option value="no">No hospitals in databse!</option>`
        }
      }).catch((err) => {
        console.error(err)
      });
})

patient_signup.addEventListener('click', () => {
    console.log('clicked')
    work_signup.classList.remove('highlighted')
    patient_signup.classList.add('highlighted')
    choose_work.classList.add('hidden')
    employee_code.classList.add('hidden')
    admin_code.classList.add('hidden')
    work_position.classList.add('hidden')
    ssn.classList.add('hidden')
    hospital.classList.add('hidden')
    date_joined.classList.add('hidden')
    employee = false
})

admin_radio.addEventListener('change', () => {
    employee_code.classList.add('hidden')
    admin_code.classList.remove('hidden')
    work_position.classList.add('hidden')
    hospital.classList.add('hidden')
    ssn.classList.add('hidden')
    date_joined.classList.add('hidden')
    work_type = 'admin'
})

employee_radio.addEventListener('change', () => {
    employee_code.classList.remove('hidden')
    admin_code.classList.add('hidden')
    work_position.classList.remove('hidden')
    hospital.classList.remove('hidden')
    ssn.classList.remove('hidden')
    date_joined.classList.remove('hidden')
    work_type = 'employee'
})

male.addEventListener('click', () => {
    male.classList.add('highlighted')
    female.classList.remove('highlighted')
    gender='male'
})

female.addEventListener('click', () => {
    female.classList.add('highlighted')
    male.classList.remove('highlighted')
    gender='female'
})

function submitForm() {
    error.innerHTML = ''
    if(validateForm()) {
        let signup_data = new FormData();
        signup_data.append('full_name', full_name.value)
        signup_data.append('email', signup_email.value)
        signup_data.append('password', signup_password.value)
        signup_data.append('gender', gender)
        signup_data.append('date_of_birth', date_of_birth.value)
        signup_data.append('user_type', 'patient')
        if(employee && work_type=='employee') {
            signup_data.append('ssn', ssn.value)
            signup_data.append('position', work_position.value)
            signup_data.append('date_joined', date_joined.value)
            signup_data.append('user_type', 'employee')
            console.log(hospital.value)
            signup_data.append('hospital', hospital.value)

        }
        if(employee && work_type=='admin') {
            signup_data.append('user_type', 'admin')
        }

        axios({
            "method": "post",
            "url": `${url}/signup.php`,
            "data": signup_data
          }).then((result) => {
            console.log(result)
            if(result.data.status == 'email already exists') {
                error.innerHTML = 'Email is already in use'
            } else if(result.data.status == 'password not validated') {
                error.innerHTML = 'Could not validate password!'
            } else if(result.data.status="user added") {
                console.log(result.data.jwt)
                localStorage.setItem('jwt', result.data.jwt);
            } else {
              console.log('noo')
            }
          }).catch((err) => {
            console.error(err)
          });
        
    }
}

function validateForm() {
    var email_regex =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    // var dob_regex =  /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{2}$/
    error.innerHTML = ''

    if(full_name.value.length == 0) {
        error.innerHTML = 'Please provide your full name!'
        full_name.classList.add('errorField')
        return false
    }
    if(!signup_email.value.match(email_regex) || signup_email.value.length == 0) {
        error.innerHTML = 'Please provide a valid email!'
        signup_email.classList.add('errorField')
        return false
    }
    if(!password_validated) {
        error.innerHTML = "Please fix your password!"
        password.classList.add('errorField')
        return false
    }
    if(signup_password.value != confirm_password.value) {
        error.innerHTML = "Passwords don't match!"
        signup_password.classList.add('errorField')
        confirm_password.classList.add('errorField')
        return false
    }
    if(date_of_birth.value.length == 0) {
        error.innerHTML = "Please enter a valid date of birth!"
        date_of_birth.classList.add('errorField')
        return false
    }
    if(employee && work_type=='employee') {
        if(employee_code.value.length == 0 && admin_code.value.length == 0) {
            error.innerHTML = 'Please a valid code!'
            employee_code.classList.add('errorField')
            admin_code.classList.add('errorField')
            return false
        }
        if(ssn.value.length == 0) {
            error.innerHTML = 'Please provide a valid SSN!'
            ssn.classList.add('errorField')
            return false
        }
        if(date_joined.value.length == 0) {
            error.innerHTML = "Please enter a valid join date!"
            date_joined.classList.add('errorField')
            return false
        }
    }
    if(employee && work_type=='admin') {
        if(employee_code.value.length == 0 && admin_code.value.length == 0) {
            error.innerHTML = 'Please a valid code!'
            employee_code.classList.add('errorField')
            admin_code.classList.add('errorField')
            return false
        }
    }
    return true
}

function logOut() {
    localStorage.removeItem('jwt')
    login_button.innerHTML = 'Log in/Sign up'
    login_button.onclick = openForm
}

function closeForm() {
    register_form.classList.remove('openForm')
    login_form.classList.remove('openForm')
    container.classList.remove('containerBlur')
}

function openLogin() {
    register_form.classList.remove('openForm');
    login_form.classList.remove('openForm');
    login_form.classList.add('openForm')
    container.classList.add('containerBlur')
}

function submitLogin() {
    let login_data = new FormData();
        login_data.append('email', login_email.value)
        login_data.append('password', login_password.value)
    axios({
        "method": "post",
        "url": `${url}/login.php`,
        "data": login_data
      }).then((result) => {
        if(result.data.status="logged in") {
            console.log(result)
            localStorage.setItem('jwt', result.data.jwt);
            if(result.data.type == 'employee') {
                window.location.href="employee.html"
            } else if (result.data.type == 'patient') {
                window.location.href="patient.html"
            } else if (result.data.type == 'admin') {
                window.location.href="admin.html"
            }
        }
      }).catch((err) => {
        console.error(err)
      });
}

function openRegister() {
register_form.classList.remove('openForm');
login_form.classList.remove('openForm');
register_form.classList.add('openForm');
container.classList.add('containerBlur');
}

signup_password.addEventListener('focus', () => {
    var validation = document.getElementById('validation')
    validation.classList.add('validationOpened')
    })

signup_password.addEventListener('focusout', () => {
    var validation = document.getElementById('validation')
    validation.classList.remove('validationOpened')
    })

// signup_password.addEventListener('keyup', () => {
//     let lower = document.getElementById("lowercase")
//     let upper = document.getElementById("uppercase")
//     let special = document.getElementById("special")
//     let number = document.getElementById("number")
//     let length = document.getElementById("length")

//     var lower_case = /[a-z]/g
//     var upper_case = /[A-Z]/g
//     var special_characters = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g
//     var numbers = /[0-9]/g

//     signup_password.value.match(lower_case) ? lower.classList.replace('error', 'correct') : lower.classList.replace('correct', 'error')
//     signup_password.value.match(upper_case) ? upper.classList.replace('error', 'correct') : upper.classList.replace('correct', 'error')
//     signup_password.value.match(special_characters) ? special.classList.replace('error', 'correct') : special.classList.replace('correct', 'error')
//     signup_password.value.match(numbers) ? number.classList.replace('error', 'correct') : number.classList.replace('correct', 'error')
//     signup_password.value.length >= 8 ? length.classList.replace('error', 'correct') : length.classList.replace('correct', 'error')

//     if(signup_password.value.match(lower_case) && signup_password.value.match(upper_case)
//     && signup_password.value.match(special_characters) && signup_password.value.match(numbers)
//     && signup_password.value.length >= 8) {
//         password_validated = true
//     } else {
//         password_validated =  false
//     }
// })