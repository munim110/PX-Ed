import { useParams } from "react-router-dom";

const AllChaptersStudent = () => {
    const { courseID } = useParams();
    console.log(courseID);
    
    return (
        <div>
        <h1>All Chapters Student</h1>
        </div>
    );
}

export default AllChaptersStudent;