import * as yup from 'yup'

export const loginSchema = yup.object({
    email: yup.string().email("It must be an E-mail.").required("E-mail must be required."),
    password: yup.string().min(8, "Password must be contain 8 Characters.").required("Password is must be required."),
 })