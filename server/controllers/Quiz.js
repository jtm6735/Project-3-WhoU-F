const models = require('../models');
const Quiz = models.Quiz;

// Creates the page for making quizzes
// Passes in the csrf token
const makerPage = (req, res) => {
  Quiz.QuizModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), quizzes: docs });
  });
};

// Makes a new quiz to be filled out
// Checks for all valid fields
const makeQuiz = (req, res) => {
  if (!req.body.name || !req.body.color || !req.body.hobby || !req.body.animal
      || !req.body.number) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const quizData = {
    name: req.body.name,
    color: req.body.color,
    hobby: req.body.hobby,
    animal: req.body.animal,
    number: req.body.number,
    owner: req.session.account._id,
  };

  const newQuiz = new Quiz.QuizModel(quizData);

  const quizPromise = newQuiz.save();

  quizPromise.then(() => res.json({ redirect: '/maker' }));

  quizPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Quiz already in use' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return quizPromise;
};

// Deletes a specified quiz and throws an error
// if something goes wrong along the way.
const deleteQuiz = (req, res) => Quiz.QuizModel.deleteById(req.body.id, (err) => {
  if (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error has occured' });
  }
  return res.status(200).json({ msg: 'The quiz has been deleted' });
});

// Load previous quizzes from the server
const getQuizzes = (request, response) => {
  const req = request;
  const res = response;

  return Quiz.QuizModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ quizzes: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getQuizzes = getQuizzes;
module.exports.make = makeQuiz;
module.exports.deleteQuiz = deleteQuiz;
