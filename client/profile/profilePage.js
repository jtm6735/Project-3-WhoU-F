// Creates the list of quiz answers
// If nothing had been completed, no data gets shown
const QuizList = function(props) {
    if(props.quizzes.length === 0) {
        return (
            <div className='quizzesList'>
                <h1 className="profileHeader"> Welcome! You haven't taken any quizzes yet!</h1>
            <h3>
                To create more information about your profile, go complete a quiz.
            </h3>
            </div>
        );
    }

    const quizNodes = props.quizzes.map(function(quiz) {
        return (
            <div key={quiz._id} className='quiz'>
                <h1 className='profileHeader'> Hello {quiz.name}! </h1>
                <h3 className='quizColor'> Your favorite color is {quiz.color} </h3>
                <h3 className='quizHobby'> {quiz.hobby} is a favored hobby of yours. </h3>
                <h3 className='quizAnimal'> {quiz.animal} is your favorite animal. </h3>
                <h3 className='quizNumber'> Your Favorite Number: {quiz.number} </h3>
            </div>
        );
    });

    return (
        <div className='quizList'>
            {quizNodes}
        </div>
    );
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