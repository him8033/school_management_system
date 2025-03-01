import * as yup from 'yup'

export const registerSchema = yup.object({
    school_name: yup.string().min(8, "School Name must contain 8 Characters.").required("School Name must be required."),
    email: yup.string().email("It must be an E-mail.").required("E-mail must be required."),
    owner_name: yup.string().min(3, "Owner Name must contain 3 Characters.").required("Owner Name must be required."),
    password: yup.string().min(8, "Password must be contain 8 Characters.").required("Password is must be required."),
    confirm_password: yup.string().oneOf([yup.ref('password')],"Confirm Password must be same with Password.").required("Confirm Password is must be required.")
})