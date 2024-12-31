import React from 'react'

function StudentGrade() {
    return (
        <div className='teacher-main-con'>
            <div className='add-teacher'>
                <form className='add-teacher-con' >
                    <div >
                        <div className='add-teacher-text'>Grade</div>
                        <div className='add-teacher-con1'>
                            <div className='add-teacher-inputs'>
                                <input
                                    value={ ''}
                                    placeholder='Student ID'
                                    type='text'
                                    readOnly
                                />
                            </div>


                            <div className='add-teacher-inputs'>
                                <select
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Select a subject
                                    </option>
                                            <option>
                                                
                                            </option>
                                </select>
                            </div>

                            <div className='add-teacher-inputs'>
                                <select
                                    // onChange={(e) =>
                                    //     setgrade({ ...grade, grade: e.target.value })
                                    // }
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Grade
                                    </option>
                                    <option>A+</option>
                                    <option>A</option>
                                    <option>A-</option>
                                    <option>B+</option>
                                    <option>B</option>
                                    <option>B-</option>
                                    <option>C+</option>
                                    <option>C</option>
                                    <option>C-</option>
                                    <option>D</option>
                                    <option>F</option>
                                </select>
                            </div>
                        </div>
                        <div className='add-teacher-button'>
                            <button>Insert</button>
                        </div>
                    </div>
                </form>
            </div>



        </div>
    )
}

export default StudentGrade
