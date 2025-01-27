import React, { useEffect, useState } from 'react';
import api from '../../../../src/api';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

function StudentGrade() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [studentGrade, setStudentGrade] = useState({});
    const [section, setSubject] = useState([]);
    const [student, setStudent] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [grades, setGrades] = useState({
        student_id: '',
        subject_id: '',
        grade: '',
    });

    // Fetch subject data
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const result = await api.get('/teacher/teacher-data');
                if (result.data.status) {
                    setSubject(result.data.subject_details);
                } else {
                    console.log('Error:', result.data.message || 'Failed to fetch subjects');
                }
            } catch (err) {
                console.error('An error occurred:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    // Fetch student details
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const result = await api.get(`/teacher/get-student/${id}`);
                if (result.data.status) {
                    setStudent(result.data.result[0]);
                    setGrades((prev) => ({ ...prev, student_id: result.data.result[0]?.id }));
                } else {
                    console.log('Error:', result.data.message);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudent();
    }, [id]);

    // Fetch student grade
    useEffect(() => {
        const fetchStudentGrade = async () => {
            try {
                const result = await api.get(`/teacher/get-student-grade/${id}`);
                if (result.data.status) {
                    setStudentGrade(result.data.result);
                } else {
                    console.log('Error:', result.data.message);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudentGrade();
    }, [id]);

    // Calculate grade value
    let gradeValue = '';
    if (studentGrade?.total >= 90 && studentGrade.total <= 100) {
        gradeValue = 'A+';
    } else if (studentGrade?.total >= 85 && studentGrade.total < 90) {
        gradeValue = 'A';
    } else if (studentGrade?.total >= 80 && studentGrade.total < 85) {
        gradeValue = 'A-';
    } else if (studentGrade?.total >= 75 && studentGrade.total < 80) {
        gradeValue = 'B+';
    } else if (studentGrade?.total >= 70 && studentGrade.total < 75) {
        gradeValue = 'B';
    } else if (studentGrade?.total >= 65 && studentGrade.total < 70) {
        gradeValue = 'B-';
    } else if (studentGrade?.total >= 60 && studentGrade.total < 65) {
        gradeValue = 'C+';
    } else if (studentGrade?.total >= 55 && studentGrade.total < 60) {
        gradeValue = 'C';
    } else if (studentGrade?.total >= 50 && studentGrade.total < 55) {
        gradeValue = 'C-';
    } else if (studentGrade?.total >= 40 && studentGrade.total < 50) {
        gradeValue = 'D';
    } else if (studentGrade?.total >= 0 && studentGrade.total < 40) {
        gradeValue = 'F';
    } else {
        gradeValue = 'Invalid Grade';
    }

    // Handle form submission
    const handelSubmit = async (e) => {
        e.preventDefault();
    
        const { subject_id, grade } = grades;
    
        if (!subject_id || !gradeValue) { // Ensure gradeValue is validated
            return toast.error('Missing Request!');
        }
    
        // Update the grades object to include the computed gradeValue
        const updatedGrades = {
            ...grades,
            grade: gradeValue,
        };
    
        try {
            const result = await api.post('/teacher/add-grade', updatedGrades);
            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result.data.message,
                    showConfirmButton: false,
                    timer: 1550,
                });
    
                navigate('/teacher-nav/student-list');
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.message || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Something went wrong!',
                showConfirmButton: true,
            });
        }
    };
    

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="teacher-main-con">
            <div className="add-teacher">
                <form className="add-teacher-con" onSubmit={handelSubmit}>
                    <div>
                        <div className="add-teacher-text">Grade</div>
                        <div className="add-teacher-con1">
                            <div className="add-teacher-inputs">
                                <input
                                    placeholder={student.name || 'Student Name'}
                                    type="text"
                                    readOnly
                                />
                            </div>

                            <div className="add-teacher-inputs">
                                <select
                                    onChange={(e) =>
                                        setGrades({ ...grades, subject_id: e.target.value })
                                    }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a subject
                                    </option>
                                    {section.map((subject) => (
                                        <option key={subject.id} value={subject.id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="add-teacher-inputs">
                                <input
                                    value={gradeValue}
                                    type="text"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="add-teacher-button">
                            <button type="submit">Insert</button>
                        </div>
                    </div>
                </form>
            </div>

            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </div>
    );
}

export default StudentGrade;
