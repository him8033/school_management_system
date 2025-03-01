import * as yup from 'yup'

export const studentSchema = yup.object({
    email: yup.string().email("It must be an E-mail.").required("E-mail must be required."),
    name: yup.string().min(3, "Student Name must contain 3 Characters.").required("Student Name must be required."),
    student_class: yup.string().required("Student Class is must be required."),
    age: yup.string().required("Age is must be required."),
    gender: yup.string().required("Gender is must be required."),
    guardian: yup.string().min(3, "Graurdin Name must containe 3 Characters").required("Guardian is must be required."),
    guardian_phone: yup.string().min(10, "Must contain 10 digits").max(12, "Cant not extend 12 digits").required("Guardian Phone Number is must be required."),
    password: yup.string().min(8, "Password must be contain 8 Characters.").required("Password is must be required."),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Confirm Password must be same with Password.").required("Confirm Password is must be required.")
})

export const studentEditSchema = yup.object({
    email: yup.string().email("It must be an E-mail.").required("E-mail must be required."),
    name: yup.string().min(3, "Student Name must contain 3 Characters.").required("Student Name must be required."),
    student_class: yup.string().required("Student Class is must be required."),
    age: yup.string().required("Age is must be required."),
    gender: yup.string().required("Gender is must be required."),
    guardian: yup.string().min(3, "Graurdin Name must containe 3 Characters").required("Guardian is must be required."),
    guardian_phone: yup.string().min(10, "Must contain 10 digits").max(12, "Cant not extend 12 digits").required("Guardian Phone Number is must be required."),
    password: yup.string().min(8, "Password must be contain 8 Characters."),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Confirm Password must be same with Password.")
})