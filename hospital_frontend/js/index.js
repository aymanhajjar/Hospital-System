const register_form = document.getElementById('registerPopup')
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
const error = document.getElementById('errormessage')
const url = 'http://localhost/hospital/hospital_backend'
let gender = 'male'
let password_validated = false
let signup_data = new FormData();
let employee = false
let work_type = 'employee'

function openForm() {
    register_form.classList.add('openForm')
    container.classList.add('containerBlur')
}

work_signup.addEventListener('click', () => {
    console.log('clicked')
    work_signup.classList.add('highlighted')
    patient_signup.classList.remove('highlighted')
    choose_work.classList.remove('hidden')
    employee_code.classList.remove('hidden')
    work_position.classList.remove('hidden')
    ssn.classList.remove('hidden')
    date_joined.classList.remove('hidden')
    employee = true
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
    date_joined.classList.add('hidden')
    employee = false
})

admin_radio.addEventListener('change', () => {
    employee_code.classList.add('hidden')
    admin_code.classList.remove('hidden')
    work_position.classList.add('hidden')
    ssn.classList.add('hidden')
    date_joined.classList.add('hidden')
    work_type = 'admin'
})

employee_radio.addEventListener('change', () => {
    employee_code.classList.remove('hidden')
    admin_code.classList.add('hidden')
    work_position.classList.remove('hidden')
    ssn.classList.remove('hidden')
    date_joined.classList.remove('hidden')
    work_type = 'employee'
})

function submitForm() {
    if(validateForm()) {
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

        }
        if(employee && work_type=='admin') {
            signup_data.append('user_type', 'admin')
        }

        axios({
            "method": "post",
            "url": `${url}/signup.php`,
          }).then((result) => {
            console.log(result)
            if(result.data.success) {
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
    var dob_regex =  /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{2}$/
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
    if(!date_of_birth.value.match(dob_regex) || date_of_birth.value.length == 0) {
        error.innerHTML = "Please enter a valid date of birth!"
        date_of_birth.classList.add('errorField')
        return false
    }
    if(employee) {
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
        if(!date_joined.value.match(dob_regex) || date_joined.value.length == 0) {
            error.innerHTML = "Please enter a valid join date!"
            date_joined.classList.add('errorField')
            return false
        }
    }
    return true
}

signup_password.addEventListener('focus', () => {
    var validation = document.getElementById('validation')
    validation.classList.add('validationOpened')
    })

signup_password.addEventListener('focusout', () => {
    var validation = document.getElementById('validation')
    validation.classList.remove('validationOpened')
    })

signup_password.addEventListener('keyup', () => {
    let lower = document.getElementById("lowercase")
    let upper = document.getElementById("uppercase")
    let special = document.getElementById("special")
    let number = document.getElementById("number")
    let length = document.getElementById("length")

    var lower_case = /[a-z]/g
    var upper_case = /[A-Z]/g
    var special_characters = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g
    var numbers = /[0-9]/g

    signup_password.value.match(lower_case) ? lower.classList.replace('error', 'correct') : lower.classList.replace('correct', 'error')
    signup_password.value.match(upper_case) ? upper.classList.replace('error', 'correct') : upper.classList.replace('correct', 'error')
    signup_password.value.match(special_characters) ? special.classList.replace('error', 'correct') : special.classList.replace('correct', 'error')
    signup_password.value.match(numbers) ? number.classList.replace('error', 'correct') : number.classList.replace('correct', 'error')
    signup_password.value.length >= 8 ? length.classList.replace('error', 'correct') : length.classList.replace('correct', 'error')

    if(signup_password.value.match(lower_case) && signup_password.value.match(upper_case)
    && signup_password.value.match(special_characters) && signup_password.value.match(numbers)
    && signup_password.value.length >= 8) {
        password_validated = true
    } else {
        password_validated =  false
    }
})