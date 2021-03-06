// Checks for if all the required fields
// have been given values. Throws an error
// if this happens.
const handleQuiz = e => {
    e.preventDefault();

    $('#quizMessage').animate({ width: 'hide' }, 350);

    if ($('#quizName').val() == '' || $('#quizColor').val() == '' || $('#quizHobby').val() == '' || $('#quizAnimal').val() == '' || $('#quizNumber').val() == '') {
        handleError('Not all questions have been answered');
        return false;
    }

    sendAjax('POST', $('#quizForm').attr('action'), $('#quizForm').serialize(), function () {
        loadQuizzesFromServer();
    });

    return false;
};

// Creates a quiz form for users to fill out 
// and answer
const QuizForm = props => {
    return React.createElement(
        'form',
        { id: 'quizForm',
            onSubmit: handleQuiz,
            name: 'quizForm',
            action: '/maker',
            method: 'POST',
            className: 'quizForm' },
        React.createElement(
            'label',
            { htmlFor: 'name' },
            'Name: '
        ),
        React.createElement('input', { id: 'quizName', type: 'text', name: 'name', placeholder: 'Name?' }),
        React.createElement(
            'label',
            { htmlFor: 'color' },
            'Color: '
        ),
        React.createElement('input', { id: 'quizColor', type: 'text', name: 'color', placeholder: 'Favorite Color?' }),
        React.createElement(
            'label',
            { htmlFor: 'hobby' },
            'Hobby: '
        ),
        React.createElement('input', { id: 'quizHobby', type: 'text', name: 'hobby', placeholder: 'Have a hobby?' }),
        React.createElement(
            'label',
            { htmlFor: 'animal' },
            'Animal: '
        ),
        React.createElement('input', { id: 'quizAnimal', type: 'text', name: 'animal', placeholder: 'Favorite animal?' }),
        React.createElement(
            'label',
            { htmlFor: 'number' },
            'Number: '
        ),
        React.createElement('input', { id: 'quizNumber', type: 'text', name: 'number', placeholder: 'Favorite number?' }),
        React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
        React.createElement('input', { className: 'makeQuizSubmit', type: 'submit', value: 'Complete Quiz' })
    );
};

// Creates the list of quiz answers
// If nothing had been completed, no data gets shown
const QuizList = function (props) {
    if (props.quizzes.length === 0) {
        return React.createElement(
            'div',
            { className: 'quizzesList' },
            React.createElement(
                'h3',
                { className: 'emptyQuiz' },
                'No Quizzes Finished Yet'
            )
        );
    }

    const quizNodes = props.quizzes.map(function (quiz) {
        return React.createElement(
            'div',
            { key: quiz._id, className: 'quiz' },
            React.createElement(
                'h3',
                { className: 'quizName' },
                ' Name: ',
                quiz.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'quizColor' },
                ' Age: ',
                quiz.color,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'quizHobby' },
                ' Hobby: ',
                quiz.hobby,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'quizAnimal' },
                ' Animal: ',
                quiz.animal,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'quizNumber' },
                ' Number: ',
                quiz.number,
                ' '
            )
        );
    });
};

// Gets the list of quizzes from the server
const loadQuizzesFromServer = () => {
    sendAjax('GET', '/getQuizzes', null, data => {});
};

// 
const setup = function (csrf) {
    ReactDOM.render(React.createElement(QuizForm, { csrf: csrf }), document.querySelector('#makeQuiz'));
};

// Gets the csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
    });
};

// Creates the setup
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
