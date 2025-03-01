import * as yup from 'yup'

export const classSchema = yup.object({
    class_text: yup.string().min(2, "Atleast 2 Characters are required.").required("Class Text must be required."),
    class_num: yup.string().required("Class Number is must be required."),
 })