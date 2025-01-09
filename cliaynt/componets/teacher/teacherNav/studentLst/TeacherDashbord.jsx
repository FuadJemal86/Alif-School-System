import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './teacherDashbord.css'
import api from '../../../../src/api';

function TeacherDashboard() {
    const [date, setDate] = useState(new Date());
    const [counter , setCounter] = useState({})



    if(counter.history_id !==0 ) {
        var attendance = (counter.present_day * 100)/counter.history_id

        attendance=attendance.toFixed(2)
    } else {
        attendance = 0
    }

    if(counter.total_grade !== 0) {
        var totalgrade = (counter.grade_average)/counter.total_grade

        totalgrade=totalgrade.toFixed(2)
    } else {
        totalgrade = 0
    }

    useEffect(() => {

        const feachData = async() => {
            try {
                const result = await api.get('/teacher/counter-number-student')

                if(result.data.status) {
                    setCounter(result.data.result[0])
                } else {
                    console.log(result.data.message)
                }
            } catch(err) {
                console.log(err)
            }
        }

        feachData()

    },[])

    const stats = [
        {
            title: "Total Students",
            value: `${counter.student_count}`,
            trend: "+12% from last month"
        },
        {
            title: "Average Grade",
            value: `${totalgrade}%`,
            trend: "+5% from last semester"
        },
        {
            title: "Attendance Rate",
            value: `${attendance}%`,
            trend: "+3% this week"
        },
        {
            title: "Active Classes",
            value: "8",
            trend: "2 new classes added"
        }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">Teacher Dashboard</h1>
                    <span className="dashboard-date">
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </span>
                </header>

                <div className="dashboard-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="dashboard-card">
                            <div className="stat-container">
                                <div className="stat-label">{stat.title}</div>
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-trend">{stat.trend}</div>
                            </div>
                        </div>
                    ))}

                    <div className="dashboard-card calendar-card">
                        <h3 className="calendar-title">Calendar</h3>
                        <Calendar
                            onChange={setDate}
                            value={date}
                            className="custom-calendar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;