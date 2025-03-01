import * as yup from 'yup'

export const noticeSchema = yup.object({
    title: yup.string().min(2, "Atleast 2 Characters are required.").required("Title must be required."),
    message: yup.string().min(8, "Atleast 8 Characters are required.").required("Message must be required."),
    audience: yup.string().required("Audience is must be required."),
 })