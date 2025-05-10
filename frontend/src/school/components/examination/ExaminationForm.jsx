import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, FormControlLabel, Switch, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Add, Delete } from '@mui/icons-material';

export default function ExaminationForm({ formik, subjects, editId, handleEditCancel, formRef, inputRef, questions, setQuestions }) {

    useEffect(() => {
        // Set existing questions for editing
        if (editId) {
            setQuestions(formik.values.questions || []);
        }
    }, [editId, formik.values.questions]);

    // Sync questions with Formik state
    useEffect(() => {
        formik.setFieldValue('questions', questions);
        const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
        const passingMarks = Math.ceil(totalMarks * 0.33);
        formik.setFieldValue('totalMarks', totalMarks);
        formik.setFieldValue('passingMarks', passingMarks);
    }, [questions]);


    // Add a new question
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', type: '', marks: 1, options: ['', '', '', ''], correctAnswer: '' }]);
    };

    // Handle change in question fields
    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
        formik.setFieldValue("questions", updatedQuestions);
    };

    // Handle option change for MCQ type
    const handleOptionChange = (index, optionIndex, value) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[index].correctAnswer === updatedQuestions[index].options[optionIndex]) {
            updatedQuestions[index].correctAnswer = value;
        }
        updatedQuestions[index].options[optionIndex] = value;
        setQuestions(updatedQuestions);
        formik.setFieldValue("questions", updatedQuestions);
    };

    // Delete a question
    const handleDeleteQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };


    return (
        <Paper sx={{ marginBottom: 3 }}>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1 },
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50vw',
                    minWidth: '230px',
                    margin: 'auto',
                    padding: 3,
                }}
                noValidate
                autoComplete="off"
                onSubmit={formik.handleSubmit}
                ref={formRef}
            >
                <Typography variant="h4" gutterBottom>
                    {editId ? 'Edit Exam' : 'Add New Exam'}
                </Typography>

                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                            label="Exam Date"
                            value={formik.values.date ? dayjs(formik.values.date) : null}
                            onChange={(newValue) => formik.setFieldValue('date', newValue)}
                            slotProps={{
                                textField: {
                                    inputRef: inputRef,
                                },
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>
                {formik.touched.date && formik.errors.date && (
                    <p style={{ color: 'red', textTransform: 'capitalize' }}>{formik.errors.date}</p>
                )}

                {/* Subject Dropdown */}
                <FormControl sx={{ mt: '10px' }} fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                        label="Subject"
                        name="subject"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <MenuItem value="">Select Subject</MenuItem>
                        {subjects && subjects.map((x) => (
                            <MenuItem key={x._id} value={x._id}>
                                {x.subject_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {formik.touched.subject && formik.errors.subject && (
                    <p style={{ color: 'red', textTransform: 'capitalize' }}>{formik.errors.subject}</p>
                )}

                {/* Exam Type */}
                <TextField
                    label="Exam Type"
                    name="examType"
                    sx={{ mt: '10px' }}
                    value={formik.values.examType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                />
                {formik.touched.examType && formik.errors.examType && (
                    <p style={{ color: 'red', textTransform: 'capitalize' }}>{formik.errors.examType}</p>
                )}

                {/* Duration */}
                <TextField
                    label="Duration (minutes)"
                    name="duration"
                    type="number"
                    sx={{ mt: '10px' }}
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                />

                {/* Is Active */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={formik.values.isActive}
                            onChange={formik.handleChange}
                            name="isActive"
                        />
                    }
                    label="Active"
                />

                {/* Questions */}
                <Typography variant="h6" sx={{ mt: 2 }}>Questions</Typography>
                {questions.map((question, qindex) => (
                    <Box key={qindex} sx={{ border: '1px solid #ccc', padding: 2, mt: 1 }}>
                        <TextField
                            label={`Question ${qindex + 1}`}
                            value={question.question}
                            onChange={(e) => handleQuestionChange(qindex, 'question', e.target.value)}
                            fullWidth
                            sx={{ mb: 1 }}
                        />
                        <div style={{display: 'flex', gap: '8px', textAlign: 'center'}}>
                        <TextField
                            label="Marks"
                            type="number"
                            value={question.marks}
                            onChange={(e) => handleQuestionChange(qindex, 'marks', e.target.value)}
                            fullWidth
                            sx={{ mb: 1 }} />
                        <FormControl fullWidth>
                            <InputLabel>Select Question Type</InputLabel>
                            <Select
                                label="Selct Question Type"
                                value={question.type}
                                onChange={(e) => handleQuestionChange(qindex, 'type', e.target.value)}
                            >
                                <MenuItem value="">Select Question Type</MenuItem>
                                <MenuItem value="MCQ">MCQ</MenuItem>
                                <MenuItem value="Text">Text</MenuItem>
                            </Select>
                        </FormControl>
                        </div>
                        {question.type === 'MCQ' && (
                            <>
                                {question.options.map((option, oindex) => (
                                    <TextField
                                        key={oindex}
                                        label={`Option ${oindex + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(qindex, oindex, e.target.value)}
                                        fullWidth
                                        sx={{ mt: 1 }}
                                    />
                                ))}
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Correct Answer</InputLabel>
                                    <Select
                                        label="Correct Answer"
                                        value={question.correctAnswer}
                                        onChange={(e) => handleQuestionChange(qindex, 'correctAnswer', e.target.value)}
                                    >
                                        {question.options.map((option, index) => (
                                            <MenuItem key={index} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        )}
                        {question.type === 'Text' && (
                            <>
                                <TextField
                                    multiline
                                    rows={4}
                                    label="Correct Answer"
                                    name="correctAnswer"
                                    sx={{ mt: '10px' }}
                                    value={question.correctAnswer}
                                    onChange={(e) => handleQuestionChange(qindex, 'correctAnswer', e.target.value)}
                                    fullWidth
                                />
                            </>
                        )}
                        <Button onClick={() => handleDeleteQuestion(qindex)} color="error" startIcon={<Delete />}>
                            Delete Question
                        </Button>
                    </Box>
                ))}
                <Button onClick={handleAddQuestion} startIcon={<Add />}>Add Question</Button>


                {/* Submit & Cancel Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button type="submit" variant="contained">Submit</Button>
                    {editId && (
                        <Button type="button" onClick={handleEditCancel} variant="outlined">Cancel</Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};