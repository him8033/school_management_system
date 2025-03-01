import * as yup from 'yup'

export const periodSchema = yup.object({
    teacher: yup.string().required("Teacher is must be required."),
    subject: yup.string().required("Subject is must be required."),
    period: yup.string().required("Period is must be required."),
    date: yup.date().required("Date is must be required"),
 })