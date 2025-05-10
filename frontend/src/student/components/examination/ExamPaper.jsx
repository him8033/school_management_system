import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Paper, Radio, TextField, Typography } from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";

export default function ExamPaper() {
    const { id: examId } = useParams();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = React.useState(true);
    const [result, setResult] = useState(null);

    const fetchExamination = async () => {
        try {
            if (examId) {
                const response = await axios.get(`${baseApi}/examination/${examId}`);
                if (response.data.exam.length > 0) {
                    setExam(response.data.exam[0]);
                } else {
                    console.error("No exam data found.");
                }
            }
        } catch (error) {
            console.error(
                `%c[ERROR in Fetching Examination]:- ${error.name || "Unknown Error"} `,
                "color: red; font-weight: bold; font-size: 14px;", error
            );
        }
    }

    useEffect(() => {
        fetchExamination();
    }, [examId]);

    const handleChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        // if (!exam || exam.questions.some(q => !answers[q._id])) {
        //     alert("Attend All The Questions")
        //     return;
        // }

        try {
            setLoading(false)
            const response = await axios.post(`${baseApi}/examination/${examId}/submit`, { answers });
            if (response.data.success) {
                setSubmitted(true);
                setResult(response.data);
                console.log(response.data)
            }
        } catch (error) {
            console.error("Error submitting exam:", error);
        } finally {
            setLoading(true);
        }
    };

    if (!exam) return <p>Loading exam...</p>;

    return (
        <>
            {!submitted ?
                (<div>
                    <Typography variant="h4" sx={{ margin: 2, textAlign: 'center' }}>{exam.examType} - [{exam.totalMarks} Marks]</Typography>
                    <Typography variant="h4" sx={{ margin: 2, textAlign: 'center' }}>{exam.subject.subject_name} [{exam.subject.subject_codename}]</Typography>

                    {!exam.questions || exam.questions.length === 0 ? (
                        <Typography variant="h6">
                            No questions available for this exam.
                        </Typography>
                    ) : (exam.questions.map((q, index) => (
                        <Card key={q._id} sx={{ margin: 2, padding: 3 }}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>{index + 1}. {q.question} [{q.marks} marks]</Typography>
                            {q.type === "MCQ" ? (
                                q.options.map((option, idx) => (
                                        <div key={idx} style={{ marginLeft: '20px' }}>
                                            <Radio
                                                checked={answers[q._id] === option}
                                                onChange={() => handleChange(q._id, option)}
                                            />
                                            {option}
                                        </div>
                                ))
                            ) : (<>
                                <Typography variant="h6">Write Your Answer Here.</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    onChange={(e) => handleChange(q._id, e.target.value)}
                                />
                            </>
                            )}
                        </Card>
                    )))}
                    {exam.questions.length > 0 &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!loading}
                            sx={{ margin: 2 }}
                        >
                            {!loading ? "Submitting..." : "Submit Exam"}
                        </Button>
                    }
                </div>)
                : (<div>
                    <Typography variant="h4" sx={{ textAlign: 'center', padding: 3 }}><b>Exam Submitted Successfully!</b></Typography>
                    {result && (
                        <div>
                            <Typography variant="h5" sx={{ textAlign: 'center', margin: 1 }}><b>Results:</b> {result.status}</Typography>
                            <Typography variant="h5" sx={{ textAlign: 'center', margin: 1 }}><b>Obtained Marks:</b> {result.obtainedMarks}</Typography>
                            <Typography variant="h5" sx={{ textAlign: 'center', margin: 1 }}><b>Total Marks:</b> {result.totalMarks}</Typography>
                            <Typography variant="h5" sx={{ textAlign: 'center', margin: 1 }}><b>Percentage:</b> {result.percentage}</Typography>

                            <Typography variant="h5" sx={{ textAlign: 'center', margin: 2 }}>
                                <b>Question-wise Breakdown:</b>
                            </Typography>

                            {result.details.map((detail, index) => (
                                <Card key={index} sx={{ margin: 2, padding: 2 }}>
                                    <Typography variant="h6">
                                        Question {index + 1}: {detail.question}
                                    </Typography>
                                    <Typography>
                                        <b>Marks Obtained:</b> {detail.marksObtained} / {detail.maxMark}
                                    </Typography>
                                    {/* <Typography sx={{ color: detail.isCorrect ? "green" : "red" }}>
                                        <b>{detail.isCorrect ? "Correct ✅" : "Incorrect ❌"}</b>
                                    </Typography> */}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>)}
        </>
    );
};
