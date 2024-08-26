const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const personDataBase = require('./models/person')
const { error } = require('console')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get('/api/persons', (req, res) => {
  personDataBase.find({}).then(person => {
    res.json(person)
  })
})
app.get('/api/persons/:id', (req, res, next) => {
  personDataBase
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  const totalPersons = persons.length
  const now = new Date()
  res.send(
    `<p>Phonebook has info for ${totalPersons} people </p> <br/> <p> ${now}</p>`
  )
})

app.post('/api/persons', (req, res, next) => {
  const { name, phone } = req.body

  const person = new personDataBase({
    name,
    phone
  })

  person
    .save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, phone } = req.body

  personDataBase
    .findByIdAndUpdate(
      req.params.id,
      { name, phone },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatePerson => {
      res.json(updatePerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  personDataBase
    .findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

app.use(morgan('tiny'))

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
