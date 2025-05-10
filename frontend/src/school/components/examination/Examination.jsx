import * as React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { examinationSchema } from '../../../yupSchema/examinationSchema.js'
import axios from 'axios';
import { baseApi } from '../../../environment.js';
import MessageSnackbar from '../../../basicUtilityComponent/snackbar/MessageSnackbar.jsx';
import ExaminationForm from './ExaminationForm.jsx';
import ExaminationList from './ExaminationList.jsx';

export default function Examination() {
  const [examinations, setExaminations] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [editId, setEditId] = React.useState(null);
  const [subjects, setSubjects] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

  const handleMessageClose = () => {
    setMessage('');
  }

  const formRef = React.useRef();
  const inputRef = React.useRef();


  const handleEdit = (id) => {
    setEditId(id);
    const selectedExamination = examinations.filter(x => x._id === id);
    formik.setFieldValue("date", selectedExamination[0].examDate);
    formik.setFieldValue("subject", selectedExamination[0].subject._id);
    formik.setFieldValue("examType", selectedExamination[0].examType);
    formik.setFieldValue("duration", selectedExamination[0].duration);
    formik.setFieldValue("totalMarks", selectedExamination[0].totalMarks);
    formik.setFieldValue("passingMarks", selectedExamination[0].passingMarks);
    formik.setFieldValue("isActive", selectedExamination[0].isActive);
    formik.setFieldValue("questions", selectedExamination[0].questions);

    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }

  const handleEditCancel = () => {
    setEditId(null);
    setQuestions([]);
    formik.resetForm();
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure! You want to Delete?")) {
      try {
        const response = await axios.delete(`${baseApi}/examination/delete/${id}`);
        // console.log("Delete Examination", response);
        setMessage(response.data.message);
        setMessageType("success");
      } catch (error) {
        console.error(
          `%c[ERROR in Deleting Examination]:- ${error.name || "Unknown Error"} `,
          "color: red; font-weight: bold; font-size: 14px;", error
        );
        setMessage("Error in Deleting Examination.");
        setMessageType("error");
      }
    }
  }

  const initialValues = {
    date: "",
    subject: "",
    examType: "",
    duration: '',
    totalMarks: '',
    passingMarks: '',
    isActive: false,
    questions: []
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (values) => {
      if (editId) {
        try {
          const response = await axios.patch(`${baseApi}/examination/update/${editId}`, {
            date: values.date,
            subjectId: values.subject,
            examType: values.examType,
            duration: values.duration,
            totalMarks: values.totalMarks,
            passingMarks: values.passingMarks,
            isActive: values.isActive,
            questions: values.questions,
            classId: selectedClass
          });
          setMessage(response.data.message);
          setMessageType("success");
          formik.resetForm();
          handleEditCancel();
          // console.log("Response Update Examination: ", response);
        } catch (error) {
          console.error(
            `%c[ERROR in Updating Examination]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
          setMessage("Error in Updating Examination");
          setMessageType("error");
        }
      } else {
        try {
          const response = await axios.post(`${baseApi}/examination/create`, {
            date: values.date,
            subjectId: values.subject,
            examType: values.examType,
            duration: values.duration,
            totalMarks: values.totalMarks,
            passingMarks: values.passingMarks,
            isActive: values.isActive,
            questions: values.questions,
            classId: selectedClass
          });
          setMessage(response.data.message);
          setMessageType("success");
          formik.resetForm();
          handleEditCancel();
          // console.log("Response New Examination: ", response);
        } catch (error) {
          console.error(
            `%c[ERROR in Adding New Examination]:- ${error.name || "Unknown Error"} `,
            "color: red; font-weight: bold; font-size: 14px;", error
          );
          setMessage("Error in saving New Examination");
          setMessageType("error");
        }
      }
    }
  })
  const [questions, setQuestions] = React.useState(formik.values.questions || []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseApi}/subject/all`);
      setSubjects(response.data.data);
    } catch (error) {
      console.error(
        `%c[ERROR in Fetching Subjects]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`);
      setClasses(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedClass(response.data.data[0]._id);
      } else {
        setSelectedClass("");
        setExaminations([]);
        setLoading(false);
      }
    } catch (error) {
      console.error(
        `%c[ERROR in Fetching Class]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
      setLoading(false);
    }
  }

  const fetchExamination = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(`${baseApi}/examination/class/${selectedClass}`);
        setExaminations(response.data.examinations);
        setLoading(false);
      }
    } catch (error) {
      console.error(
        `%c[ERROR in Fetching Examination]:- ${error.name || "Unknown Error"} `,
        "color: red; font-weight: bold; font-size: 14px;", error
      );
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchClasses();
  }, [])

  React.useEffect(() => {
    fetchSubjects();
    fetchExamination();
  }, [message, selectedClass])

  return (
    <>
      <Typography variant='h4' sx={{ fontWeight: '700' }}>Examination</Typography>
      {message && <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}
      <Paper sx={{ marginBottom: 3 }}>
        <Box >
          <FormControl sx={{ margin: 2, minWidth: '210px' }} >
            <InputLabel id="demo-simple-select-label">Class</InputLabel>
            <Select
              label="Class"
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value) }}
            >
              <MenuItem value="">Select Class</MenuItem>
              {classes && classes.map(x => {
                return (<MenuItem key={x._id} value={x._id}>{x.class_text} [{x.class_num}]</MenuItem>)
              })}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <ExaminationForm
        formik={formik}
        subjects={subjects}
        editId={editId}
        handleEditCancel={handleEditCancel}
        formRef={formRef}
        inputRef={inputRef}
        questions={questions}
        setQuestions={setQuestions}
      />

      <ExaminationList
        examinations={examinations}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
}
