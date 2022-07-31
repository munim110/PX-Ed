import React from 'react'
import { useEffect } from 'react';

import Loading from './Loading'
import { useGlobalContext } from '../context'
import Course from './SingleCourse'

const course_url = 'http://127.0.0.1:8000/api/courses/?search='

const CourseList = () => {
    const { courses, setCourses, loading, setLoading, courseSearchTerm } = useGlobalContext();
    const fetchCourses = async () => {
        setLoading(true);
        console.log(courseSearchTerm)
        try{
            const response = await fetch(`${course_url}${courseSearchTerm}`);
            const data = await response.json();
            if(data.length > 0){
                const courses = data.map(course => {
                    console.log(course);
                    return {
                        id: course.id,
                        name: course.name,
                        description: course.description,
                        instructor: course.instructor,
                        thumbnail: course.thumbnail,
                    };
                });
                setCourses(courses);
            }else{
                setCourses([]);
            }
            setLoading(false);
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        fetchCourses();
    }, [courseSearchTerm]);

    if (loading) {
        return <Loading />
    }

    if (!courses.length) {
        return (
            <h2 className='section-title'>
                No courses found for your keyword
            </h2>
        );
    }

    return (
        <section className='section'>
            <h2 className='section-title'>Courses</h2>
            <div className='course-center'>
                {courses.map(course => {
                    return <Course key={course.id} {...course} />
                }
                )}
            </div>
        </section>
    );
}

export default CourseList;