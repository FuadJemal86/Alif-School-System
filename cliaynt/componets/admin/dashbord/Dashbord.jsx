import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts';
import '../dashbord/dashbord.css'
import { PieChart } from '@mui/x-charts/PieChart';
import api from '../../../src/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChalkboardUser, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
function Dashbord() {

    const [teacher, setTeacher] = useState()
    const [student, setStudent] = useState()
    const [dip, setDip] = useState()
    // const [teacher , setTeacher] = useState()
    // const [teacher , setTeacher] = useState()

    const getTeacher = async () => {
        try {
            const result = await api.get('/auth/teacher-total')

            if (result.data.status) {
                setTeacher(result.data.result[0].teacherTotal)
            } else {

            }
        } catch (err) {
            console.log(err)
        }
    }

    const getStudent = async () => {
        try {
            const result = await api.get('/auth/student-total')

            if (result.data.status) {
                setStudent(result.data.result[0].studentTotal)
            } else {
                console.log(result.data.error)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const getDip = async () => {
        try {
            const result = await api.get('/auth/dip-total')

            if (result.data.status) {
                setDip(result.data.result[0].dipTotal)
            } else {
                console.log(result.data.error)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {

        getTeacher();
        getStudent();
        getDip()

    }, [])


    const chartData = [
        { value: 40, label: 'Group A' },
        { value: 30, label: 'Group B' },
        { value: 20, label: 'Group C' },
        { value: 10, label: 'Group D' },
    ];
    return (
        <div className='dashbord-conatiner'>


            <div className='box-container'>
                <div className='box-container1'>

                    <div className='dashborde-box'>
                        <div className='dollar-icone1'>
                            <div className='card-text'>TEACHERS</div>
                            <div className='dollar-icone'><FontAwesomeIcon icon={faChalkboardUser} /></div>
                        </div>
                        <div className='card-numbers'>{teacher}</div>
                        <div className='total-teachers-main'><div className='total-teachers'>Total Teachers</div></div>

                    </div>

                    <div className='dashborde-box'>
                        <div className='dollar-icone1'>
                            <div className='card-text'>STUDENT</div>
                            <div className='student-icone'> <FontAwesomeIcon icon={faUserGraduate} /></div>
                        </div>
                        <div className='card-numbers'>{student}</div>
                        <div className='total-teachers-main'><div className='total-teachers'>Total Student</div></div>
                    </div>

                    <div className='dashborde-box'>
                        <div className='dollar-icone1'>
                            <div className='card-text'>DIPARTMENT</div>
                            <div className='student-icone'><FontAwesomeIcon icon={faGraduationCap} /></div>
                        </div>
                        <div className='card-numbers'>{dip}</div>
                        <div className='total-teachers-main'><div className='total-teachers'>Total Dip-</div></div>

                    </div>

                    <div className='dashborde-box'>
                        <div className='dollar-icone1'>
                            <div className='card-text'>STUDENT</div>
                            <div className='student-icone'><FontAwesomeIcon icon={faGraduationCap} /></div>
                        </div>
                        <div className='card-numbers'>{student}</div>
                        <div className='total-teachers-main'><div className='total-teachers'>Total Teachers</div></div>

                    </div>

                </div>
            </div>

            <div className='dashbord-conatiner1'>
                <div className='piChart-box'>
                    <PieChart
                        width={300}
                        height={300}
                        series={[
                            {
                                data: chartData,
                                innerRadius: 40,
                                outerRadius: 100,
                                paddingAngle: 5,
                                cornerRadius: 5,
                                startAngle: -45,
                                endAngle: 225,
                                cx: 150,
                                cy: 150,
                            },
                        ]}
                    />
                </div>

                <div className='chart-box'>
                    <BarChart
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: ['Group A', 'Group B', 'Group C'],
                            },
                        ]}
                        series={[
                            { data: [4, 3, 5], label: 'Series 1' },
                            { data: [1, 6, 3], label: 'Series 2' },
                            { data: [2, 5, 6], label: 'Series 3' },
                        ]}
                        width={520}
                        height={300}
                    />
                </div>


            </div>


        </div>
    )
}

export default Dashbord
