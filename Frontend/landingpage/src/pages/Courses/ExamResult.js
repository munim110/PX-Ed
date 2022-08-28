import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserName } from '../../Utils'
import Loading from '../../components/Loading'

const examResultURL = 'http://127.0.0.1:8000/api/exam-attempt/'
const examURL = 'http://127.0.0.1:8000/api/exams/'

const ExamResultPage = () => {
    const { ExamResultID } = useParams();
    const { setUseNavbar, setAuthenticated, setSpecialUser } = useGlobalContext();

    //State
    const [loading, setLoading] = React.useState(true);
    const [obtainedMarks, setObtainedMarks] = React.useState(-1);
    const [examID, setExamID] = React.useState(0);
    const [totalMarks, setTotalMarks] = React.useState(0);
    const [courseName, setCourseName] = React.useState('');
    const [examName, setExamName] = React.useState('');
    const [chapterName, setChapterName] = React.useState('');
    const [courseID, setCourseID] = React.useState(0);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [verified, setVerified] = React.useState(false);
    const [isGraded, setIsGraded] = React.useState(false);

    //Questions
    const [MCQQuestions, setMCQQuestions] = React.useState([]);
    const [trueFalseQuestions, setTrueFalseQuestions] = React.useState([]);
    const [shortAnswerQuestions, setShortAnswerQuestions] = React.useState([]);

    //Answers
    const [MCQAnswers, setMCQAnswers] = React.useState('');
    const [TrueFalseAnswers, setTrueFalseAnswers] = React.useState('');
    const [ShortAnswerAnswers, setShortAnswerAnswers] = React.useState('');

    //Check Answers
    const [correctMCQQuestions, setCorrectMCQQuestions] = React.useState([]);
    const [correctTrueFalseQuestions, setCorrectTrueFalseQuestions] = React.useState([]);
    const [correctMCQAnswers, setCorrectMCQAnswers] = React.useState([]);
    const [correctTrueFalseAnswers, setCorrectTrueFalseAnswers] = React.useState([]);
    const [wrongMCQQuestions, setWrongMCQQuestions] = React.useState([]);
    const [wrongTrueFalseQuestions, setWrongTrueFalseQuestions] = React.useState([]);
    const [wrongMCQAnswers, setWrongMCQAnswers] = React.useState([]);
    const [wrongTrueFalseAnswers, setWrongTrueFalseAnswers] = React.useState([]);
    const [shortAnsweArray, setShortAnsweArray] = React.useState([]);

    //Load Page
    useEffect(() => {
        setUseNavbar(true);
        setAuthenticated(localStorage.getItem('authenticated'));
        setSpecialUser(localStorage.getItem('specialUser') === 'true');
    }, []);

    //Load Exam Result
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const response = await fetch(examResultURL + ExamResultID + "/");
            const body = await response.json();
            console.log(body);
            setMCQAnswers(body.question_answers);
            setTrueFalseAnswers(body.truefalse_answers);
            setShortAnswerAnswers(body.short_answers);
            setObtainedMarks(body.total_marks);
            setIsGraded(body.is_graded);
            setExamID(body.exam.id);
        }
        fetchData();
        setLoading(false);
    }, [ExamResultID]);

    useEffect(() => {
        if (obtainedMarks !== -1) {
            setLoading(true);
            //Load Exam
            const fetchData = async () => {
                const response = await fetch(examURL + examID + "/");
                const body = await response.json();
                console.log(body);

                setTotalMarks(body.total_marks);
                setExamName(body.exam_name);
                setCourseName(body.exam_course.name);
                setCourseID(body.exam_course.id);
                setChapterName(body.exam_chapter.name);

                //Set MCQ Questions
                body.questions.map(question => {
                    setMCQQuestions(OldMCQs => [...OldMCQs, question]);
                })

                //Set TrueFalse Questions
                body.truefalse.map(question => {
                    setTrueFalseQuestions(OldTrueFalses => [...OldTrueFalses, question]);
                })

                //Set ShortAnswer Questions
                body.shortquestions.map(question => {
                    setShortAnswerQuestions(OldShortAnswers => [...OldShortAnswers, question]);
                })

                setLoading(false);
                setDataLoaded(true);
            }
            fetchData();
        }
    }, [examID]);

    useEffect(() => {
        if (dataLoaded) {
            setLoading(true);

            //Split Answers
            const MCQAnsArray = MCQAnswers.split('$').filter(x => x);
            const TrueFalseAnsArray = TrueFalseAnswers.split('$').filter(x => x);
            const ShortAnswerAnsArray = ShortAnswerAnswers.split('$').filter(x => x);

            //Check MCQ Answers
            MCQQuestions.map((question, index) => {
                let correctAnswer = "";
                let userAnswer = "";

                if (question.answer === 'a') {
                    correctAnswer = question.option_a;
                }
                else if (question.answer === 'b') {
                    correctAnswer = question.option_b;
                }
                else if (question.answer === 'c') {
                    correctAnswer = question.option_c;
                }
                else if (question.answer === 'd') {
                    correctAnswer = question.option_d;
                }

                if (MCQAnsArray[index] === 'a') {
                    userAnswer = question.option_a;
                }
                else if (MCQAnsArray[index] === 'b') {
                    userAnswer = question.option_b;
                }
                else if (MCQAnsArray[index] === 'c') {
                    userAnswer = question.option_c;
                }
                else if (MCQAnsArray[index] === 'd') {
                    userAnswer = question.option_d;
                }
                else {
                    userAnswer = "nothing";
                }

                if (question.answer === MCQAnsArray[index]) {
                    setCorrectMCQQuestions(OldCorrectMCQs => [...OldCorrectMCQs, question]);
                    let response = "The answer " + correctAnswer + " is correct";
                    setCorrectMCQAnswers(OldCorrectMCQAnswers => [...OldCorrectMCQAnswers, response]);
                }
                else {
                    setWrongMCQQuestions(OldWrongMCQs => [...OldWrongMCQs, question]);
                    let response = "The answer is " + correctAnswer + " and you answered " + userAnswer;
                    setWrongMCQAnswers(OldWrongMCQAnswers => [...OldWrongMCQAnswers, response]);
                }
            })

            //Check TrueFalse Answers
            trueFalseQuestions.map((question, index) => {
                let correctAnswer = "";
                let userAnswer = "";

                if (question.answer.toString() === 'true') {
                    correctAnswer = "true";
                }
                else if (question.answer.toString() === 'false') {
                    correctAnswer = "false";
                }

                if (TrueFalseAnsArray[index] === 'true') {
                    userAnswer = "true";
                }
                else if (TrueFalseAnsArray[index] === 'false') {
                    userAnswer = "false";
                }
                else {
                    userAnswer = "nothing";
                }

                if (question.answer.toString() === TrueFalseAnsArray[index]) {
                    setCorrectTrueFalseQuestions(OldCorrectTrueFalses => [...OldCorrectTrueFalses, question]);
                    let response = "The statement is " + correctAnswer;
                    setCorrectTrueFalseAnswers(OldCorrectTrueFalseAnswers => [...OldCorrectTrueFalseAnswers, response]);
                }
                else {
                    setWrongTrueFalseQuestions(OldWrongTrueFalses => [...OldWrongTrueFalses, question]);
                    let response = "The statement is " + correctAnswer + " and you answered " + userAnswer;
                    setWrongTrueFalseAnswers(OldWrongTrueFalseAnswers => [...OldWrongTrueFalseAnswers, response]);
                }
            })

            //Check ShortAnswer Answers
            shortAnswerQuestions.map((question, index) => {
                let userAnswer = ShortAnswerAnsArray[index];
                if (userAnswer === "none") {
                    userAnswer = "nothing";
                }
                userAnswer = "You answered " + userAnswer;
                setShortAnsweArray(OldShortAnswers => [...OldShortAnswers, userAnswer]);
            })

            setLoading(false);
            setVerified(true);
        }
    }, [dataLoaded]);

    useEffect(() => {
        if (verified) {
            setLoading(true);

            console.log(correctMCQQuestions);
            console.log(correctMCQAnswers);
            console.log(wrongMCQQuestions);
            console.log(wrongMCQAnswers);

            console.log(correctTrueFalseQuestions);
            console.log(correctTrueFalseAnswers);
            console.log(wrongTrueFalseQuestions);
            console.log(wrongTrueFalseAnswers);

            console.log(shortAnsweArray);

            setLoading(false);
        }
    }, [verified]);

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
                    {isGraded === true? <h2>Total Marks: {obtainedMarks} / {totalMarks}</h2> : <h2>Auto Marks: {obtainedMarks} / {totalMarks}</h2>}
                </div>

                <div className='exam-section-wrapper'>
                    {MCQQuestions.length > 0 ?
                        <>
                            <h2>MCQ Questions</h2>
                            {wrongMCQQuestions.map((question, index) => {
                                return (
                                    <div key={question.question} className='wrong-text'>
                                        <h3>{question.question} (Mark: {question.marks})</h3>
                                        <h3>{wrongMCQAnswers[index]}</h3>
                                    </div>
                                )
                            })}
                            {correctMCQQuestions.map((question, index) => {
                                return (
                                    <div key={question.question} className='correct-text'>
                                        <h3>{question.question} (Mark: {question.marks})</h3>
                                        <h3>{correctMCQAnswers[index]}</h3>
                                    </div>
                                )
                            })}
                        </> : null
                    }
                </div>

                <div className='exam-section-wrapper'>
                    {trueFalseQuestions.length > 0 ?
                        <>
                            <h2>TrueFalse Questions</h2>
                            {wrongTrueFalseQuestions.map((question, index) => {
                                return (
                                    <div key={question.question} className='wrong-text'>
                                        <h3>{question.question} (Mark: {question.marks})</h3>
                                        <h3>{wrongTrueFalseAnswers[index]}</h3>
                                    </div>
                                )
                            })}

                            {correctTrueFalseQuestions.map((question, index) => {
                                return (
                                    <div key={question.question} className='correct-text'>
                                        <h3>{question.question} (Mark: {question.marks})</h3>
                                        <h3>{correctTrueFalseAnswers[index]}</h3>
                                    </div>
                                )
                            })}
                        </> : null
                    }
                </div>

                <div className='exam-section-wrapper'>
                    {shortAnswerQuestions.length > 0 ? 
                        <>
                            <h2>Short Questions</h2>
                            {shortAnswerQuestions.map((question, index) => {
                                return (
                                    <div key={question.question}>
                                        <h3>{question.question} (Mark: {question.marks})</h3>
                                        <h3>{shortAnsweArray[index]}</h3>
                                    </div>
                                )
                            })}
                        </> : null}
                </div>

                <div className='exam-submit-button-wrapper'>
                    <Link className='enroll-button' style={{ 'width': '20%' }} to={`/chapters/${courseID}`}>Back to Chapters</Link>
                </div>

            </div>

        </div>
    )
}

export default ExamResultPage;