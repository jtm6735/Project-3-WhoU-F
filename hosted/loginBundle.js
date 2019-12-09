// Checks for both inputs to be filled
// with text. If no text is in one or either
// box, an error will be thrown.
const handleLogin = e => {
    e.preventDefault();

    $("#quizMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty!");
        return false;
    }

    console.log($("input[name=_csrf").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// Check to see if the new user has
// filled out the fields
// Check if both passwords match
const handleSignup = e => {
    e.preventDefault();

    $("#quizMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
        handleError("Passwords do not match.");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

// Creates form used to login with
// username and password
const LoginWindow = props => {
    return React.createElement(
        "form",
        { id: "loginForm", name: "loginForm",
            onSubmit: handleLogin,
            action: "/login",
            method: "POST",
            className: "mainForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
    );
};

// Creates form for signing up
// This form uses the username,
// password, and confirmed password
const SignupWindow = props => {
    return React.createElement(
        "form",
        { id: "signupForm", name: "signupForm",
            onSubmit: handleSignup,
            action: "/signup",
            method: "POST",
            className: "mainForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Username: "
        ),
        React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "Username" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "Password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "Retype Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign up" })
    );
};

// Creates login view in the center of the page
const createLoginWindow = csrf => {
    ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector('#content'));
};

// Creates login view in the center of the page
const createSignupWindow = csrf => {
    ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector('#content'));
};

// Depending on if login or sign up is clicked,
// a different view is created
const setup = csrf => {
    const loginButton = document.querySelector('#loginButton');
    const signupButton = document.querySelector('#signupButton');

    signupButton.addEventListener('click', e => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener('click', e => {
        e.preventDefault();
        createLoginWindow();
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
    });
};

// Load in the csrf token
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
