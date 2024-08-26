const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect(url)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        const phoneRegex = /^(\d{2,3})-(\d{5,})$/
        return phoneRegex.test(v)
      },
      message: props =>
        `${props.value} no es un número de teléfono válido. Debe estar en el formato XX-XXXXXXX o XXX-XXXXXXXX`
    },
    required: [true, 'El número de teléfono es obligatorio'],
    minlength: [8, 'El número de teléfono debe tener al menos 8 caracteres']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('phonebook', personSchema)
