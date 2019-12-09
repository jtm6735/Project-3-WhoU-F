// Creates the list of quiz answers
// If nothing had been completed, no data gets shown
const QuizList = function (props) {
    if (props.quizzes.length === 0) {
        return React.createElement(
            'div',
            { className: 'quizzesList' },
            React.createElement(
                'h1',
                { className: 'profileHeader' },
                ' Welcome! You haven\'t taken any quizzes yet!'
            ),
            React.createElement(
                'h3',
                null,
                'To create more information about your profile, go complete a quiz.'
            )
        );
    }

    const quizNodes = props.quizzes.map(function (quiz) {
        return React.createElement(
            'div',
            { key: quiz._id, className: 'quiz' },
            React.createElement(
                'h1',
                { className: 'profileHeader' },
                ' Hello ',
                quiz.name,
                '! '
            ),
            React.createElement(
                'h3',
                { className: 'quizColor' },
                ' Your favorite color is ',
                quiz.color,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'quizHobby' },
                ' ',
                quiz.hobby,
                ' is a favored hobby of yours. '
            ),
            React.createElement(
                'h3',
                { className: 'quizAnimal' },
                ' ',
                quiz.animal,
                ' is your favorite animal. '
            ),
            React.createElement(
                'h3',
                { className: 'quizNumber' },
                ' Your Favorite Number: ',
                quiz.number,
                ' '
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'quizList' },
        quizNodes
    );
};

// Loads in any finished quiz from the
// server, for the particular user
const loadQuizzesFromServer = () => {
    sendAjax('GET', '/getQuizzes', null, data => {
        ReactDOM.render(React.createElement(QuizList, { quizzes: data.quizzes }), document.querySelector('#quizzes'));
    });
};

// Setups up the content to be populated
const setup = function () {
    ReactDOM.render(React.createElement(QuizList, { quizzes: [] }), document.querySelector('#quizzes'));

    loadQuizzesFromServer();
};

// Function which will call the setup
const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
    });
};

// Populates the setup
$(document).ready(function () {
    getToken();
});
// Functions to be used across the rest
// of the bundles created
const handleError = message => {
  $('#errorMessage').text(message);
  $('#quizMessage').animate({ height: 'toggle' }, 300);
};

const redirect = response => {
  $('#quizMessage').animate({ height: 'hide' }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
