// Checks if the user has filled in all the fields
// Depending on varying outcomes, the error message is different
const handleChange = e => {
    e.preventDefault();

    $("#quizMessage").animate({ width: 'hide' }, 350); //change

    if ($("#currPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    if ($('#newPass').val() !== $('#newPass1').val()) {
        handleError("The passwords do not match.");
        return false;
    }

    if ($('#currPass').val() === $('#newPass').val()) {
        handleError("The new Password is the same as old password.");
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changeForm').serialize(), () => {
        handleError('The Password has been changed');
    });

    return false;
};

// Create the changed password with the
// current, new, and confirmed new password
const ChangePassword = props => {
    return React.createElement(
        "form",
        { id: "changeForm", name: "changeForm",
            onSubmit: handleChange,
            action: "/changePassword",
            method: "POST",
            className: "changeForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Current Password: "
        ),
        React.createElement("input", { id: "currPass", type: "text", name: "currPass", placeholder: "Current Password" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPass1", type: "password", name: "newPass1", placeholder: "New Password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Retype New Password: "
        ),
        React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "Retype New Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
    );
};

// Preps to render error messages in content
const setup = csrf => {
    ReactDOM.render(React.createElement(ChangePassword, { csrf: csrf }), document.querySelector('#content'));
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, result => {
        setup(result.csrfToken);
    });
};

// Displays content from the setup
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
