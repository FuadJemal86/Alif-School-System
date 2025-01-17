import '../dashbord/dashbord.css'
import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Users, GraduationCap, School, BookOpen, TrendingUp, ChevronUp } from 'lucide-react';
import api from '../../../src/api';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (


    <div className="stat-card">
        <div className="stat-header">
            <div className="stat-icon" style={{ background: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div className="stat-trend" style={{ color: trend >= 0 ? '#22c55e' : '#ef4444' }}>
                <ChevronUp size={20} />
                <span>{Math.abs(trend)}%</span>
            </div>
        </div>
        <div className="stat-content">
            <h3>{title}</h3>
            <h2>{value.toLocaleString()}</h2>
        </div>
        <div className="stat-footer">
            <div className="progress-bar" style={{ '--progress': `${trend}%`, '--color': color }}></div>
        </div>
    </div>


);

const Dashbord = () => {
    const [teacherInfo, setTeacherInfo] = useState({});
    const [dipInfo, setDipInfo] = useState({});
    const [studentInfo, setStudentInfo] = useState({});
    const [stats, setStats] = useState({
        teachers: 0,
        students: 0,
        departments: 0,
        courses: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        feahTeacherCounter();
        feahDipCounter();
        feahStudentCounter();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setStats({
                teachers: teacherInfo.teacherTotal || 0,
                students: studentInfo.studentTotal || 0,
                departments: dipInfo.dipTotal || 0,
                courses: 86
            });
            setLoading(false);
        }, 1000);
    }, [teacherInfo, dipInfo, studentInfo]);

    const [isLoading, setIsLoading] = useState(false)
    const feahTeacherCounter = async () => {
        setIsLoading(true)
        try {
            const result = await api.get('/auth/teacher-total');
            if (result.data.status) {
                setTeacherInfo(result.data.result[0]);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    };

    const feahDipCounter = async () => {
        setIsLoading(true)
        try {
            const result = await api.get('/auth/dip-total');
            if (result.data.status) {
                setDipInfo(result.data.result[0]);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        }  finally {
            setIsLoading(false)
        }
    };

    const feahStudentCounter = async () => {
        setIsLoading(true)
        try {
            const result = await api.get('/auth/student-total');
            if (result.data.status) {
                setStudentInfo(result.data.result[0]);
            } else {
                console.log(result.data.message);
            }
        } catch (err) {
            console.log(err);
        }  finally {
            setIsLoading(false)
        }
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="loader"></span>
            </div>
        );
    }

    const monthlyData = [
        { name: 'Jan', students: 4000, teachers: 2400, courses: 1800 },
        { name: 'Feb', students: 4500, teachers: 2600, courses: 2000 },
        { name: 'Mar', students: 4200, teachers: 2800, courses: 2200 },
        { name: 'Apr', students: 5000, teachers: 2900, courses: 2400 },
        { name: 'May', students: 4800, teachers: 3000, courses: 2600 },
        { name: 'Jun', students: 5200, teachers: 3200, courses: 2800 },
    ];

    const performanceData = [
        { name: 'Mon', value: 65 },
        { name: 'Tue', value: 78 },
        { name: 'Wed', value: 85 },
        { name: 'Thu', value: 72 },
        { name: 'Fri', value: 90 },
        { name: 'Sat', value: 68 },
        { name: 'Sun', value: 82 },
    ];

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Academic Dashboard</h1>
                    <p>Welcome back! Here's what's happening with your institution.</p>
                </div>
                <div className="header-actions">
                    <div className="date-picker">
                        <span>Last 30 Days</span>
                        <TrendingUp size={20} />
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Teachers"
                    value={stats.teachers}
                    icon={Users}
                    trend={12}
                    color="#6366f1"
                />
                <StatCard
                    title="Total Students"
                    value={stats.students}
                    icon={GraduationCap}
                    trend={8}
                    color="#22c55e"
                />
                <StatCard
                    title="Departments"
                    value={stats.departments}
                    icon={School}
                    trend={-3}
                    color="#eab308"
                />
                <StatCard
                    title="Active Courses"
                    value={stats.courses}
                    icon={BookOpen}
                    trend={15}
                    color="#ec4899"
                />
            </div>

            <div className="charts-grid">
                <div className="chart-card enrollment-trends">
                    <h3>Enrollment Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="students"
                                stroke="#6366f1"
                                fillOpacity={1}
                                fill="url(#colorStudents)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card performance-chart">
                    <h3>Weekly Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashbord;
