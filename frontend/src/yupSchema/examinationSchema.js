import * as yup from 'yup'

export const examinationSchema = yup.object({
    date: yup.date().required("Date is must be required"),
    subject: yup.string().required("Subject is must be required."),
    examType: yup.string().required("Exam Type is must be required."),
})