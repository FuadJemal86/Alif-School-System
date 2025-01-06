import React, { useState } from 'react'
import './teacherDashbord.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function TeacherDashbord() {
    const [date, setDate] = useState(new Date());
    return (
        <div>
            <div className='main-dashbord-container'>
                <div className='main-dashbord-container1'>
                    <div className='t-dashbord-text'>Dashbord</div>
                    <div className='t-dashbord-main'>

                        <div className='t-dashbord-box gradient-1'>
                            <div>
                                <div>Total Student</div>
                                <div>50</div>
                            </div>

                            <div>
                                <div>Average Grade</div>
                                <div>50</div>
                            </div>
                        </div>

                        <div className='t-dashbord-box gradient-1'>
                            <div>
                                <div>Attendance Rate</div>
                                <div>50</div>
                            </div>

                            <div>
                                <div>Active Classes</div>
                                <div>50</div>
                            </div>
                        </div>

                        <div className='t-dashbord-box gradient-1'>
                            <div>
                                <h3 >Select a Date</h3>
                                <Calendar
                                    onChange={setDate}
                                    value={date}
                                    className='custom-calendar'
                                />
                            </div>
                        </div>

                        <div className='t-dashbord-box gradient-1'>
                            <div>
                                <div>Total Student</div>
                                <div>50</div>
                            </div>

                            <div>
                                <div>Total Student</div>
                                <div>50</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TeacherDashbord
