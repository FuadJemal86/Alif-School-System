import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSchool, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../sitting/sitting.css";
import api from "../../../src/api";
import Swal from "sweetalert2";

function Sitting() {
    // Function to handle file input trigger
    const handleFileSelect = (inputId) => {
        document.getElementById(inputId).click();
    };

    const handleSubmit = (section) => {
        console.log(`${section} submitted`);
    };

    const [images, setImages] = useState({
        description: '',
        image: ''
    })

    const [teachImage, setTeacherImage] = useState({
        name: '',
        description: '',
        image: ''
    })



    const handelSchool = async (c) => {

        c.preventDefault()

        const formData = new FormData()

        formData.append('image', images.image)
        formData.append('description', images.description)



        try {
            const result = await api.post('/auth/school-image', formData)
            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Student added successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                FeachDataSchool()

            } else {
                console.log(result.data.message)
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.error || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.log(err)
        }

    }

    const handelTeacher = async (c) => {

        c.preventDefault()

        const formData = new FormData()

        formData.append('name', teachImage.name)
        formData.append('description', teachImage.description)
        formData.append('image', teachImage.image)

        try {
            const result = await api.post('/auth/teacher-image', formData)
            if (result.data.status) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Student added successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                FeachData()

            } else {
                console.log(result.data.message)
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: result.data.error || 'Something went wrong!',
                    showConfirmButton: true,
                });
            }
        } catch (err) {
            console.log(err)
        }

    }

    const [schoolImage, setSchoolImage] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {

        FeachDataSchool()
        FeachData()

    }, [])

    const FeachDataSchool = async () => {
        setIsLoading(true)
        try {
            const result = await api.get('/auth/get-schoolImage')

            if (result.data.status) {
                setSchoolImage(result.data.result)
            } else {
                console.log(result.data.error)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    const FeachData = async () => {
        try {
            const result = await api.get('/auth/get-teacherImage')

            if (result.data.status) {
                setteacherImage(result.data.result)
            } else {
                console.log(result.data.error)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const [teacherImage, setteacherImage] = useState([])


    const schoolDelete = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {

                if (result.isConfirmed) {
                    const responce = await api.delete(`/auth/delete-school-image/${id}`);

                    if (responce.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        FeachDataSchool()
                    }

                } else {
                    console.error(err.message)
                }

            });

        } catch (err) {
            console.error(err);
        }
    }


    const teacherDelete = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {



                if (result.isConfirmed) {
                    const responce = await api.delete(`/auth/delete-teacher-info/${id}`);

                    if (responce.data.status) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        FeachData()
                    }

                } else {
                    console.error(err.message)
                }

            });

        } catch (err) {
            console.error(err);
        }
    }

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <span class="loader"></span>
            </div>
        );
    }

    return (
        <div className="sitting-main-container">
            <div className="siting-school-image">
                <h4>School Images</h4>
                <div className="siting-school-image1">
                    {
                        schoolImage.map((c) => (
                            <div className="main-sitting-text">
                                <div className="sitting-text" key={c.id}>
                                    <div className="sitting-tresh"> <span onClick={() => schoolDelete(c.id)} style={{ color: '#FA4032', cursor: 'pointer', marginRight: '10px' }} ><FontAwesomeIcon icon={faTrash} /></span></div>
                                    <img src={`https://fuad.jmcpharma.com/image/${c.image}`} alt="" srcset="" />
                                    <div>{c.discription}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="siting-school-image">
                <h4>Teachers Info</h4>
                <div className="siting-school-image1">
                    {
                        teacherImage.map((c) => (
                            <div className="main-sitting-text">
                                <div className="sitting-text" key={c.id}>
                                    <div className="sitting-tresh"> <span onClick={() => teacherDelete(c.id)} style={{ color: '#FA4032', cursor: 'pointer', marginRight: '10px' }} ><FontAwesomeIcon icon={faTrash} /></span></div>
                                    <img src={`https://fuad.jmcpharma.com/image/${c.image}`} alt="" srcset="" />
                                    <strong>{c.name}</strong>
                                    <div className="t-image-des">{c.discription}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="sitting-main">
                <div className="sitting-container">
                    <h3>School Image</h3>
                    <form onSubmit={handelSchool} >
                        <div className="sitting-box">
                            <input
                                placeholder="Description"
                                type="text"
                                onChange={e => setImages({ ...images, description: e.target.value })}
                            />
                            <div>
                                {/* Hidden File Input */}
                                <input
                                    id="schoolFileInput"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={e => setImages({ ...images, image: e.target.files[0] })}
                                />
                                {/* Custom Upload Icon */}
                                <FontAwesomeIcon
                                    icon={faImage}
                                    style={{
                                        fontSize: "2rem",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleFileSelect("schoolFileInput")}
                                />
                            </div>
                            <button onClick={() => handleSubmit("School Image")}>Submit</button>
                        </div>
                    </form>
                </div>

                {/* Teacher Image Section */}
                <div className="sitting-container">

                    <h3>Teacher Info</h3>
                    <form onSubmit={handelTeacher}>
                        <div className="sitting-box">
                            <input
                                placeholder="Name"
                                type="text"
                                onChange={e => setTeacherImage({ ...teachImage, name: e.target.value })}
                            />
                            <input
                                placeholder="Description"
                                type="text"
                                onChange={e => setTeacherImage({ ...teachImage, description: e.target.value })}
                            />
                            <div>
                                {/* Hidden File Input */}
                                <input
                                    id="teacherFileInput"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={e => setTeacherImage({ ...teachImage, image: e.target.files[0] })}
                                />
                                {/* Custom Upload Icon */}
                                <FontAwesomeIcon
                                    icon={faImage}
                                    style={{
                                        fontSize: "2rem",
                                        color: "#4caf50",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleFileSelect("teacherFileInput")}
                                />
                            </div>
                            <button onClick={() => handleSubmit("Teacher Image")}>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Sitting;

