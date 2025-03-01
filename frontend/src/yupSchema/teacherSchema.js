import * as yup from 'yup'

export const teacherSchema = yup.object({
    email: yup.string().email("It must be an E-mail.").required("E-mail must be required."),
    name: yup.string().min(3, "Teacher Name must contain 3 Characters.").required("Teacher Name must be required."),
    qualification: yup.string().min(4, "Qualification must be contain 4 Characters").required("Qualification is must be required."),
    age: yup.string().required("Age is must be required."),
    gender: yup.string().required("Gender is must be required."),
    password: yup.string().min(8, "Password must be contain 8 Characters.").required("Password is must be required."),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Confirm Password must be same with Password.").required("Confirm Password is must be required.")
})

export const teacherEditSchema = yup.object({
    email: yup.string().email("It must be an E-mail.").required("E-mail must be required."),
    name: yup.string().min(3, "Teacher Name must contain 3 Characters.").required("Teacher Name must be required."),
    qualification: yup.string().min(4, "Qualification must be contain 4 Characters").required("Qualification is must be required."),
    age: yup.string().required("Age is must be required."),
    gender: yup.string().required("Gender is must be required."),
    password: yup.string().min(8, "Password must be contain 8 Characters."),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Confirm Password must be same with Password.")
})