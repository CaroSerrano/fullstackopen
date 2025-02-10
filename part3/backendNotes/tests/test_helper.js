const Note = require('../models/note')
const User = require('../models/user')

const setInitialNotes = async () => {
  const users = Object.values(await usersInDb());
  const randomUser = users[Math.floor(Math.random()*users.length)]
  const initialNotes = [
    {
      content: 'HTML is easy',
      important: false,
      user: randomUser.id
    },
    {
      content: 'Browser can execute only JavaScript',
      important: true,
      user: randomUser.id
    }
  ]
  
  return initialNotes
}

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  setInitialNotes, nonExistingId, notesInDb, usersInDb
}