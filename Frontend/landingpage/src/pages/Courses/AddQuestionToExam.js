import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const CourseURL = 'http://127.0.0.1:8000/api/courses/';
const MCQURL = 'http://127.0.0.1:8000/api/add-mcq/';
const TrueFalseURL = 'http://127.0.0.1:8000/api/add-truefalse/'
const ShortQuestionURL = 'http://127.0.0.1:8000/api/add-shortquestion/'

const AddQuestionToExam = () => {
    const { courseID, ExamID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    // State
    const [isInstructor, setIsInstructor] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // Three state arrays for three question types
    const [MCQs, setMCQs] = React.useState([]);
    const [TrueFalse, setTrueFalse] = React.useState([]);
    const [ShortQuestions, setShortQuestions] = React.useState([]);

    // Count of questions
    const [MCQCount, setMCQCount] = React.useState(0);
    const [TrueFalseCount, setTrueFalseCount] = React.useState(0);
    const [ShortQuestionCount, setShortQuestionCount] = React.useState(0);
    const [totalCount, setTotalCount] = React.useState(0);

    // Errors
    const [MCQError, setMCQError] = React.useState(false);
    const [TrueFalseError, setTrueFalseError] = React.useState(false);
    const [ShortQuestionError, setShortQuestionError] = React.useState(false);

    const [success, setSuccess] = React.useState(false);

    // Load page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    // Navigator
    const navigate = useNavigate();
    useEffect(() => {
        if (success) {
            navigate(`/allexamstoaddquestion/${courseID}`);
        }
    }, [success]);

    // Functions
    const AddNewMCQ = () => {
        setMCQCount(MCQCount + 1);
        setTotalCount(totalCount + 1);
        setMCQs([...MCQs, {
            question: '',
            correctAnswer: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            marks: ''
        }]);
        console.log(MCQCount);
    }

    const AddNewTrueFalse = () => {
        setTrueFalseCount(TrueFalseCount + 1);
        setTotalCount(totalCount + 1);
        setTrueFalse([...TrueFalse, {
            question: '',
            correctAnswer: '',
            marks: ''
        }]);
        console.log(TrueFalseCount);
    }

    const AddNewShortQuestion = () => {
        setShortQuestionCount(ShortQuestionCount + 1);
        setTotalCount(totalCount + 1);
        setShortQuestions([...ShortQuestions, {
            question: '',
            correctAnswer: '',
            marks: ''
        }]);
        console.log(ShortQuestionCount);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMCQError(false);
        setTrueFalseError(false);
        setShortQuestionError(false);

        let MError = false;
        let TError = false;
        let SError = false;

        let submittedMCQs = [];
        let submittedTrueFalse = [];
        let submittedShortQuestions = [];

        // Handle MCQs
        if (MCQCount > 0) {
            console.log(MCQs);
            for (let i = 0; i < MCQCount; i++) {
                console.log(MCQs[i]);
                if (MCQs[i].question === '' || MCQs[i].correctAnswer === '' || MCQs[i].optionA === '' || MCQs[i].optionB === '' || MCQs[i].optionC === '' || MCQs[i].optionD === '' || MCQs[i].marks === '') {
                    MError = true;
                    continue;
                }
                const data = { question: MCQs[i].question, answer: MCQs[i].correctAnswer.toLowerCase(), option_a: MCQs[i].optionA, option_b: MCQs[i].optionB, option_c: MCQs[i].optionC, option_d: MCQs[i].optionD, marks: MCQs[i].marks, exam: ExamID };
                const response = await fetch(MCQURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }).then(res => res.json()).catch(err => console.log(err));
                console.log(response);

                submittedMCQs.push(MCQs[i]);
            }
        }

        // Handle TrueFalse
        if (TrueFalseCount > 0) {
            for (let i = 0; i < TrueFalseCount; i++) {
                console.log(TrueFalse[i]);
                if (TrueFalse[i].question === '' || TrueFalse[i].correctAnswer === '' || TrueFalse[i].marks === '') {
                    TError = true;
                    continue;
                }
                const data = { question: TrueFalse[i].question, answer: TrueFalse[i].correctAnswer, marks: TrueFalse[i].marks, exam: ExamID };
                const response = await fetch(TrueFalseURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }).then(res => res.json()).catch(err => console.log(err));
                console.log(response);

                submittedTrueFalse.push(TrueFalse[i]);
            }
        }

        // Handle ShortQuestions
        if (ShortQuestionCount > 0) {
            for (let i = 0; i < ShortQuestionCount; i++) {
                console.log(ShortQuestions[i]);
                if (ShortQuestions[i].question === '' || ShortQuestions[i].correctAnswer === '' || ShortQuestions[i].marks === '') {
                    SError = true;
                    continue;
                }
                const data = { question: ShortQuestions[i].question, answer: ShortQuestions[i].correctAnswer, marks: ShortQuestions[i].marks, exam: ExamID };
                const response = await fetch(ShortQuestionURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }).then(res => res.json()).catch(err => console.log(err));
                console.log(response);

                submittedShortQuestions.push(ShortQuestions[i]);
            }
        }

        // Remove Successful Questions
        submittedMCQs.forEach((item) => {
            const newMCQs = MCQs.map((mcq) => {
                if (mcq.question !== item.question) {
                    return mcq;
                }
            })
            setMCQs(newMCQs);
            setMCQCount(MCQCount - 1);
            setTotalCount(totalCount - 1);
        });

        submittedTrueFalse.forEach((item) => {
            console.log(item);
            const newTrueFalse = TrueFalse.map((tf) => {
                if (tf.question !== item.question) {
                    return tf;
                }
            })
            setTrueFalse(newTrueFalse);
            setTrueFalseCount(TrueFalseCount - 1);
            setTotalCount(totalCount - 1);
        });

        submittedShortQuestions.forEach((item) => {
            const newShortQuestions = ShortQuestions.map((sq) => {
                if (sq.question !== item.question) {
                    return sq;
                }
            })
            setShortQuestions(newShortQuestions);
            setShortQuestionCount(ShortQuestionCount - 1);
            setTotalCount(totalCount - 1);
        });

        // Set Errors
        if (MError) {
            console.log('MCQ Error');
            setMCQError(true);
        }
        if (TError) {
            setTrueFalseError(true);
        }
        if (SError) {
            setShortQuestionError(true);
        }
        if (!MError && !TError && !SError) {
            setSuccess(true);
        }
    }

    // Render page
    if (loading) {
        return <Loading />
    }

    return (
        <div className='add-question-wrapper'>
            <div className='header-text'>
                <h2>Add Questions</h2>
            </div>
            <div className='add-question-section'>

                <div className='add-question-buttons'>

                    <div><button className="enroll-button" onClick={() => AddNewMCQ()}>Add MCQ</button></div>
                    <div><button className="enroll-button" onClick={() => AddNewTrueFalse()}>Add True False</button></div>
                    <div><button className="enroll-button" onClick={() => AddNewShortQuestion()}>Add Short Questions</button></div>

                </div>
                <form onSubmit={handleSubmit}>
                    <div className='add-question-question-section'>
                        {MCQCount > 0 && <div className='question'>
                            <h2>MCQ:</h2>
                            {Array.from(Array(MCQCount).keys()).map(i => {
                                return (
                                    <div key={i}>
                                        <h3>{i + 1}</h3>

                                        <div className='blog-input-wrapper'>

                                            <label className='blog-input-label'>Question</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newMCQs = MCQs.map((mcq, j) => {
                                                        if (j != i) {
                                                            return mcq;
                                                        }
                                                        return { ...mcq, question: e.target.value };
                                                    });
                                                    setMCQs(newMCQs);
                                                }
                                            } />
                                        </div>

                                        <div className='blog-input-wrapper'>

                                            <label className='blog-input-label'>Option A</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newMCQs = MCQs.map((mcq, j) => {
                                                        if (j != i) {
                                                            return mcq;
                                                        }
                                                        return { ...mcq, optionA: e.target.value };
                                                    });
                                                    setMCQs(newMCQs);
                                                }
                                            } />

                                        </div>

                                        <div className='blog-input-wrapper'>

                                            <label className='blog-input-label'>Option B</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newMCQs = MCQs.map((mcq, j) => {
                                                        if (j != i) {
                                                            return mcq;
                                                        }
                                                        return { ...mcq, optionB: e.target.value };
                                                    });
                                                    setMCQs(newMCQs);
                                                }
                                            } />
                                        </div>

                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Option C</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newMCQs = MCQs.map((mcq, j) => {
                                                        if (j != i) {
                                                            return mcq;
                                                        }
                                                        return { ...mcq, optionC: e.target.value };
                                                    });
                                                    setMCQs(newMCQs);
                                                }
                                            } />
                                        </div>

                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Option D</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newMCQs = MCQs.map((mcq, j) => {
                                                        if (j != i) {
                                                            return mcq;
                                                        }
                                                        return { ...mcq, optionD: e.target.value };
                                                    });
                                                    setMCQs(newMCQs);
                                                }
                                            } />
                                        </div>

                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Correct Option</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newMCQs = MCQs.map((mcq, j) => {
                                                        if (j != i) {
                                                            return mcq;
                                                        }
                                                        return { ...mcq, correctAnswer: e.target.value };
                                                    });
                                                    setMCQs(newMCQs);
                                                }
                                            } />
                                        </div>

                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Marks</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newMCQs = MCQs.map((mcq, j) => {
                                                        if (j != i) {
                                                            return mcq;
                                                        }
                                                        return { ...mcq, marks: e.target.value };
                                                    });
                                                    setMCQs(newMCQs);
                                                }
                                            } />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}
                    </div>

                    <div className='add-question-question-section'>

                        {TrueFalseCount > 0 && <div className='question'>

                            <h2>True False:</h2>
                            {Array.from(Array(TrueFalseCount).keys()).map(i => {
                                return (
                                    <div key={i}>
                                        <h3>{i + 1}</h3>

                                        <div className='blog-input-wrapper'>

                                            <label className='blog-input-label'>Question</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newTrueFalses = TrueFalse.map((trueFalse, j) => {
                                                        if (j != i) {
                                                            return trueFalse;
                                                        }
                                                        return { ...trueFalse, question: e.target.value };
                                                    });
                                                    setTrueFalse(newTrueFalses);
                                                }
                                            } />
                                        </div>
                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Answer</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newTrueFalses = TrueFalse.map((trueFalse, j) => {
                                                        if (j != i) {
                                                            return trueFalse;
                                                        }
                                                        return { ...trueFalse, correctAnswer: e.target.value };
                                                    });
                                                    setTrueFalse(newTrueFalses);
                                                }
                                            } />
                                        </div>
                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Marks</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newTrueFalses = TrueFalse.map((trueFalse, j) => {
                                                        if (j != i) {
                                                            return trueFalse;
                                                        }
                                                        return { ...trueFalse, marks: e.target.value };
                                                    });
                                                    setTrueFalse(newTrueFalses);
                                                }
                                            } />
                                        </div>

                                    </div>
                                )
                            })}
                        </div>}

                    </div>

                    <div className='add-question-question-section'>

                        {ShortQuestionCount > 0 && <div className='question'>

                            <h2>Short Questions:</h2>

                            {Array.from(Array(ShortQuestionCount).keys()).map(i => {
                                return (
                                    <div key={i}>
                                        <h3>{i + 1}</h3>

                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Question</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newShortQuestions = ShortQuestions.map((shortQuestion, j) => {
                                                        if (j != i) {
                                                            return shortQuestion;
                                                        }
                                                        return { ...shortQuestion, question: e.target.value };
                                                    });
                                                    setShortQuestions(newShortQuestions);
                                                }
                                            } />
                                        </div>
                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Answer</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newShortQuestions = ShortQuestions.map((shortQuestion, j) => {
                                                        if (j != i) {
                                                            return shortQuestion;
                                                        }
                                                        return { ...shortQuestion, correctAnswer: e.target.value };
                                                    });
                                                    setShortQuestions(newShortQuestions);
                                                }
                                            } />
                                        </div>
                                        <div className='blog-input-wrapper'>
                                            <label className='blog-input-label'>Marks</label>
                                            <input className='update-profile-form-field' type='text' onChange={
                                                (e) => {
                                                    const newShortQuestions = ShortQuestions.map((shortQuestion, j) => {
                                                        if (j != i) {
                                                            return shortQuestion;
                                                        }
                                                        return { ...shortQuestion, marks: e.target.value };
                                                    });
                                                    setShortQuestions(newShortQuestions);
                                                }
                                            } />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}

                    </div>

                    <div className='add-question-button-wrapper' style={{ 'width': '99%' }}>
                        {totalCount > 0 && <button className='enroll-button' type="submit">Add Questions</button>}
                        {(MCQError || TrueFalseError || ShortQuestionError) && <span className='add-blog-error-text'>Could Not Add These Questions</span>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddQuestionToExam;