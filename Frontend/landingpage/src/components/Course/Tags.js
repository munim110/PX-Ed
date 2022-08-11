import { useGlobalContext } from '../../context'
import { Link } from 'react-router-dom'
import { tagArray } from '../../Utils'

const TagsComponent = ({ tags }) => {
    const { setCourseSearchTerm } = useGlobalContext();

    const searchForCourseByTag = (tag) => {
        if (tag) {
            setCourseSearchTerm(tag.tag);
        }
    }

    const tag_color = {
        color: '#fff',
    }

    return (
        <div className='course-tags'>
            {tags && tagArray(tags).map(tag => {
                return <Link to={`/courses/`} key={tag} style={tag_color} onClick={() => searchForCourseByTag({ tag })}>#{tag} </Link>
            })}
        </div>
    )
}

export default TagsComponent;