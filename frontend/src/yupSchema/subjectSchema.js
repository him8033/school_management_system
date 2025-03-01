import * as yup from 'yup'

export const subjectSchema = yup.object({
    subject_name: yup.string().min(2, "Atleast 2 Characters are required.").required("Subject Name must be required."),
    subject_codename: yup.string().required("Subject Codename is must be required."),
 })