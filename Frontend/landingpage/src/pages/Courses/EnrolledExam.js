import React, { useEffect, useRef } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const examURL = 'http://127.0.0.1:8000/api/exams/'

const TakeExam = () => {
    const { ExamID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    //State
    const [loading, setLoading] = React.useState(true);
    const [isEnrolled, setIsEnrolled] = React.useState(false);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [examName, setExamName] = React.useState('');
    const [courseName, setCourseName] = React.useState('');
    const [chapterName, setChapterName] = React.useState('');

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
    const timerID = useRef(null);

    //Timer Clear
    const clearTimer = () => {
        window.clearInterval(timerID.current);
    }

    //Timer UseEffect
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    useEffect(() => {
        if (time === 0) {
            console.log('time is up');
            clearTimer();
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
        fetchExamData();
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(MCQAnswers);
        console.log(trueFalseAnswers);
        console.log(shortAnswers);
    }

    //Render
    if (loading) {
        return <Loading />
    }

    return (
        <div className='exam-page-wrapper'>

            <div></div>

            <div>
                <div className='exam-info-wrapper'>
                    <h2>Course: {courseName}</h2>
                    <h2>Chapter: {chapterName}</h2>
                    <h2>Exam: {examName}</h2>
                    <h2>Time: {time}</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='exam-section-wrapper'>
                        {MCQQuestions.length > 0 ?
                            <>
                                <h2>MCQ Questions</h2>
                                {MCQQuestions.map((question, index) => {
                                    return (
                                        <div key={index} className='exam-mcq-wrapper'>
                                            <h3>{index + 1}.{question.question}</h3>
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
                                            <h3>{index + 1}.{question.question}</h3>
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
                                            <h3>{index + 1}.{question.question}</h3>
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

                </form>
            </div>

            <div></div>

        </div>
    );
}

export default TakeExam;