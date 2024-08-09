const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
  {
    id: 1,
    name: 'Mario Hellas',
    phone: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    phone: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    phone: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    phone: '39-23-6423122'
  }
]
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.static('dist'))
// app.get('/', (req, res) => {
//   res.send('Hello, Render!')
// })

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => {
    return person.id === id
  })

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  const totalPersons = persons.length
  const now = new Date()
  res.send(
    `<p>Phonebook has info for ${totalPersons} people </p> <br/> <p> ${now}</p>`
  )
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, phone } = req.body
  if (!name || !phone) {
    return res.status(400).json({
      message: 'name or phone missing',
      error: 'name or phone missing'
    })
  }
  const personExist = persons.find(person => person.name === name)

  if (personExist) {
    return res.status(400).json({
      message: 'The name already exist in the db',
      error: 'The name already exist in the db'
    })
  }

  const newPerson = {
    id: persons.length + 1,
    name,
    phone
  }

  persons = persons.concat(newPerson)

  res.status(201).json({
    message: 'Person added successfully',
    newPerson: newPerson
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
