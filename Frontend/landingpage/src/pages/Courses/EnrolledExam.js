import React, { useEffect, useRef } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getUserID, getUserName } from '../../Utils'
import Loading from '../../components/Loading'

import ReactModal from 'react-modal';

const examURL = 'http://127.0.0.1:8000/api/exams/'
const examAttemptURL = 'http://127.0.0.1:8000/api/add-exam-attempt/'
const examAttempts = 'http://127.0.0.1:8000/api/exam-attempt/?search='
const courseURL = 'http://127.0.0.1:8000/api/enrolledcourses/?search='

const TakeExam = () => {
    const { ExamID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    //State
    const [loading, setLoading] = React.useState(true);
    const [isEnrolled, setIsEnrolled] = React.useState(false);
    const [alreadyAttempted, setAlreadyAttempted] = React.useState(false);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [examName, setExamName] = React.useState('');
    const [courseName, setCourseName] = React.useState('');
    const [courseID, setCourseID] = React.useState('');
    const [chapterName, setChapterName] = React.useState('');
    const [examAttemtID, setExamAttemtID] = React.useState(-1);

    //Exam Questions
    const [MCQQuestions, setMCQQuestions] = React.useState([]);
    const [trueFalseQuestions, setTrueFalseQuestions] = React.useState([]);
    const [shortQuestions, setShortQuestions] = React.useState([]);

    //Exam Answers
    const [MCQAnswers, setMCQAnswers] = React.useState([]);
    const [trueFalseAnswers, setTrueFalseAnswers] = React.useState([]);
    const [shortAnswers, setShortAnswers] = React.useState([]);

    //Timer
    const [time, setTime] = React.useState(-1);
    const [showPopup, setShowPopup] = React.useState(false);
    const [pageOpacity, setPageOpacity] = React.useState(1);
    const timerID = useRef(null);

    //Timer Clear
    const clearTimer = () => {
        window.clearInterval(timerID.current);
    }

    //Load Page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    //Timer UseEffect
    useEffect(() => {
        if (time === 0) {
            console.log('time is up');
            clearTimer();
            setShowPopup(true);
        }
        else {
            timerID.current = window.setInterval(() => {
                setTime(time => time - 1);
            }, 1000);
            return () => {
                clearTimer();
            }
        }
    }, [time]);

    //Load Exam Data
    useEffect(() => {
        const fetchExamData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${examURL}${ExamID}/`);
                const data = await response.json();
                console.log(data);

                if (!dataLoaded) {
                    setTime(parseInt(data.exam_duration));
                    setDataLoaded(true);
                }

                //Names
                setExamName(data.exam_name);
                setChapterName(data.exam_chapter.name);
                setCourseName(data.exam_course.name);
                setCourseID(data.exam_course.id);

                //MCQ Questions
                data.questions.map(question => {
                    console.log(question);
                    setMCQQuestions(OldMCQs => [...OldMCQs, question]);
                    setMCQAnswers(OldMCQs => [...OldMCQs, 'f']);
                })

                //True False Questions
                data.truefalse.map(question => {
                    console.log(question);
                    setTrueFalseQuestions(OldTFs => [...OldTFs, question]);
                    setTrueFalseAnswers(OldTFs => [...OldTFs, 'none']);
                })

                //Short Questions
                data.shortquestions.map(question => {
                    console.log(question);
                    setShortQuestions(OldSHs => [...OldSHs, question]);
                    setShortAnswers(OldSHs => [...OldSHs, 'none']);
                })

            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }

        const checkAlreadyAttempted = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${examAttempts}${ExamID}`);
                const data = await response.json();
                console.log(data);
                if (data.length > 0) {
                    data.map(attempt => {
                        if (attempt.user.id === getUserID()) {
                            setAlreadyAttempted(true);
                            setExamAttemtID(attempt.id);
                        }
                    })
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        fetchExamData();
        checkAlreadyAttempted();
    }, [ExamID]);

    useEffect(() => {
        console.log(MCQQuestions);
    }, [MCQQuestions])

    useEffect(() => {
        console.log(trueFalseQuestions);
    }, [trueFalseQuestions])

    useEffect(() => {
        console.log(shortQuestions);
    }, [shortQuestions])

    useEffect(() => {
        setPageOpacity(0.5);
    }, [showPopup]);

    useEffect(() => {
        console.log(isEnrolled);
    }, [isEnrolled])

    useEffect(() => {
        const checkEnrolled = async () => {
            setLoading(true);
            try {
                if (getUserID() !== '') {
                    console.log(getUserID());
                    const response = await fetch(`${courseURL}${getUserID()}`);
                    console.log(`${courseURL}${getUserID()}`);
                    const data = await response.json();
                    console.log(data);
                    if (data.length > 0) {
                        data.map(course => {
                            console.log(course.course.id);
                            console.log(courseID);
                            if (course.course.id === courseID) {
                                setIsEnrolled(true);
                            }
                        })
                    }
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false);
            }
        }
        checkEnrolled();
    }, [courseID]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(MCQAnswers);
        console.log(trueFalseAnswers);
        console.log(shortAnswers);

        // Process MCQs
        let MCQAnswerProcessed = '';
        MCQAnswers.map(answer => {
            //Blank Answer
            if (answer === 'f') {
                MCQAnswerProcessed += '-$';
            }
            //Answer
            else {
                MCQAnswerProcessed += answer + '$';
            }
        })

        // Process True False
        let TFAnswerProcessed = '';
        trueFalseAnswers.map(answer => {
            //Blank Answer
            if (answer === 'none') {
                TFAnswerProcessed += '-$';
            }
            //Answer
            else {
                TFAnswerProcessed += answer + '$';
            }
        })

        // Process Short Questions
        let SHAnswerProcessed = '';
        shortAnswers.map(answer => {
            //Blank Answer
            if (answer === 'none') {
                SHAnswerProcessed += '-$';
            }
            //Answer
            else {
                SHAnswerProcessed += answer + '$';
            }
        })

        const data = { 'exam': ExamID, 'user': getUserID(), 'question_answers': MCQAnswerProcessed, 'truefalse_answers': TFAnswerProcessed, 'short_answers': SHAnswerProcessed };
        console.log(data);
        const response = await fetch(examAttemptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).catch(err => console.log(err));
        console.log(response);
        setExamAttemtID(response.id);
    }

    // Navigation
    let navigate = useNavigate();
    useEffect(() => {
        if (examAttemtID !== -1) {
            navigate('/examresult/' + examAttemtID);
        }
    }, [examAttemtID]);

    //Render
    if (loading) {
        return <Loading />
    }

    if (isEnrolled === false) {
        return (
            <section className="error-page section">

                <div className="error-container">

                    <h1>You Are Not Enrolled To The Course Yet!</h1>
                    <Link to="/home" className='btn btn-primary'>
                        Return Home
                    </Link>

                </div>

            </section>
        )
    }

    return (
        <div className='exam-page-wrapper' style={{ 'opacity': { pageOpacity } }}>

            <div>
            </div>

            <div>
                <div className='exam-info-wrapper'>
                    <h2>Course: {courseName}</h2>
                    <h2>Chapter: {chapterName}</h2>
                    <h2>Exam: {examName}</h2>
                    <h2>Time: {time}</h2>
                </div>

                <form onSubmit={handleSubmit} id="ExamForm">
                    <div className='exam-section-wrapper'>
                        {MCQQuestions.length > 0 ?
                            <>
                                <h2>MCQ Questions</h2>
                                {MCQQuestions.map((question, index) => {
                                    return (
                                        <div key={index} className='exam-mcq-wrapper'>
                                            <h3>{index + 1}.{question.question} (Mark: {question.marks})</h3>
                                            <div className='exam-mcq-answer-wrapper'>
                                                <div className='exam-mcq-answer'>
                                                    <input type='radio' name={question.question} id={question.option_a + question.id} value='a' onChange={
                                                        (e) => {
                                                            const newMCQAnswers = MCQAnswers.map((answer, i) => {
                                                                if (i === index) {
                                                                    return e.target.value;
                                                                }
                                                                return answer;
                                                            })
                                                            setMCQAnswers(newMCQAnswers);
                                                        }
                                                    } />
                                                    <label htmlFor={question.option_a + question.id}>{question.option_a}</label>
                                                </div>
                                                <div className='exam-mcq-answer'>
                                                    <input type='radio' name={question.question} id={question.option_b + question.id} value='b' onChange={
                                                        (e) => {
                                                            const newMCQAnswers = MCQAnswers.map((answer, i) => {
                                                                if (i === index) {
                                                                    return e.target.value;
                                                                }
                                                                return answer;
                                                            })
                                                            setMCQAnswers(newMCQAnswers);
                                                        }
                                                    } />
                                                    <label htmlFor={question.option_b + question.id}>{question.option_b}</label>
                                                </div>
                                                <div className='exam-mcq-answer'>
                                                    <input type='radio' name={question.question} id={question.option_c + question.id} value='c' onChange={
                                                        (e) => {
                                                            const newMCQAnswers = MCQAnswers.map((answer, i) => {
                                                                if (i === index) {
                                                                    return e.target.value;
                                                                }
                                                                return answer;
                                                            })
                                                            setMCQAnswers(newMCQAnswers);
                                                        }
                                                    } />
                                                    <label htmlFor={question.option_c + question.id}>{question.option_c}</label>
                                                </div>
                                                <div className='exam-mcq-answer'>
                                                    <input type='radio' name={question.question} id={question.option_d + question.id} value='d' onChange={
                                                        (e) => {
                                                            const newMCQAnswers = MCQAnswers.map((answer, i) => {
                                                                if (i === index) {
                                                                    return e.target.value;
                                                                }
                                                                return answer;
                                                            })
                                                            setMCQAnswers(newMCQAnswers);
                                                        }
                                                    } />
                                                    <label htmlFor={question.option_d + question.id}>{question.option_d}</label>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </> : null
                        }
                    </div>

                    <div className='exam-section-wrapper'>
                        {trueFalseQuestions.length > 0 ?
                            <>
                                <h2>True False Questions</h2>
                                {trueFalseQuestions.map((question, index) => {
                                    return (
                                        <div key={index} className='exam-tf-wrapper'>
                                            <h3>{index + 1}.{question.question} (Mark: {question.marks})</h3>
                                            <div className='exam-tf-answer-wrapper'>
                                                <div className='exam-mcq-answer'>
                                                    <input type='radio' name={question.question} id={question.id + 'true'} value='true' onChange={
                                                        (e) => {
                                                            const newTFAnswers = trueFalseAnswers.map((answer, i) => {
                                                                if (i === index) {
                                                                    return e.target.value;
                                                                }
                                                                return answer;
                                                            })
                                                            setTrueFalseAnswers(newTFAnswers);
                                                        }
                                                    } />
                                                    <label htmlFor={question.id + 'true'}>True</label>
                                                </div>
                                                <div className='exam-mcq-answer'>
                                                    <input type='radio' name={question.question} id={question.id + 'false'} value='false' onChange={
                                                        (e) => {
                                                            const newTFAnswers = trueFalseAnswers.map((answer, i) => {
                                                                if (i === index) {
                                                                    return e.target.value;
                                                                }
                                                                return answer;
                                                            })
                                                            setTrueFalseAnswers(newTFAnswers);
                                                        }
                                                    } />
                                                    <label htmlFor={question.id + 'false'}>False</label>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </> : null
                        }
                    </div>

                    <div className='exam-section-wrapper'>
                        {shortQuestions.length > 0 ?
                            <>
                                <h2>Short Questions</h2>
                                {shortQuestions.map((question, index) => {
                                    return (
                                        <div className='blog-input-wrapper' key={index}>
                                            <h3>{index + 1}.{question.question} (Mark: {question.marks})</h3>
                                            <input type='text' className='update-profile-form-field' name={question.question} id={question.id} onChange={
                                                (e) => {
                                                    const newShortAnswers = shortAnswers.map((answer, i) => {
                                                        if (i === index) {
                                                            return e.target.value;
                                                        }
                                                        return answer;
                                                    })
                                                    setShortAnswers(newShortAnswers);
                                                }
                                            } />
                                        </div>
                                    )
                                })}
                            </> : null}
                    </div>

                    <div className='exam-submit-button-wrapper'>
                        <button className='enroll-button' type="submit" style={{ 'width': '20%' }}>Submit</button>
                    </div>

                    <ReactModal
                        isOpen={showPopup}
                        contentLabel="Time's Up"
                        className="time-up-popup"
                        shouldCloseOnOverlayClick={false}
                        shouldCloseOnEsc={false}
                        preventScroll={true}
                    >
                        <h1>Time Is Up!</h1>
                        <button className='enroll-button' type="submit" style={{ 'width': '20%' }} form="ExamForm">Submit</button>
                    </ReactModal>

                </form>
            </div>

            <div></div>

        </div>
    );
}

export default TakeExam;