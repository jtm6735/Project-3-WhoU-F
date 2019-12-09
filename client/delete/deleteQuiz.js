const QuizList = function(props) {
    if(props.quizzes.length === 0) {
        return (
            <div className='quizzesList'>
                <h3 className='emptyQuiz'>Nothing to delete yet</h3>
            </div>
        );
    }

    const quizNodes = props.quizzes.map(function(quiz) {
        return (
            <div key={quiz._id} className='quiz'>
                <h3 onClick="deleteQuiz(e)" className='quizName'> Name: {quiz.name} </h3>
                <h3 onClick="deleteQuiz(e)" className='quizColor'> Age: {quiz.color} </h3>
                <h3 onClick="deleteQuiz(e)" className='quizHobby'> Hobby: {quiz.hobby} </h3>
                <h3 onClick="deleteQuiz(e)" className='quizAnimal'> Animal: {quiz.animal} </h3>
                <h3 onClick="deleteQuiz(e)" className='quizNumber'> Number: {quiz.number} </h3>
            </div>
        );
    });

    return (
        <div className='quizList'>
            {quizNodes}
        </div>
    );
};


const deleteQuiz = (e) => {
	const id = e.target.parentElement.querySelector('.quizId').innerText;
	const _csrf = document.querySelector('input[name="_csrf"]').value;
	
    console.log("delete processed");
    
	sendAjax('DELETE', '/deleteQuiz', {id, _csrf}, data => {
		loadQuizzesFromServer();
	});
};

// Loads in any finished quiz from the
// server, for the particular user
const loadQuizzesFromServer = () => {
    sendAjax('GET', '/getQuizzes', null, (data) => {
        ReactDOM.render(
            <QuizList quizzes={data.quizzes} />, document.querySelector('#quizzes')
        );
    });
};

// Setups up the content to be populated
const setup = function() {
    ReactDOM.render(
        <QuizList quizzes={[]} />, document.querySelector('#quizzes')
    );

    loadQuizzesFromServer();
};

// Function which will call the setup
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// Populates the setup
$(document).ready(function() {
    getToken();
});