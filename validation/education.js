const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateExperienceInput (data) {
  let errors = {}

  data.school = !isEmpty(data.school) ? data.school : ''
  data.degree = !isEmpty(data.degree) ? data.degree : ''
  data.from = !isEmpty(data.from) ? data.from : ''
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : ''

  if (Validator.isEmail(data.school)) {
    errors.school = 'School field is required'
  }
  if (Validator.isEmail(data.degree)) {
    errors.degree = 'Degree field is required'
  }
  if (Validator.isEmail(data.fieldofstudy)) {
    errors.degree = 'Field of study field is required'
  }

  if (Validator.isEmail(data.from)) {
    errors.from = 'From date field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
