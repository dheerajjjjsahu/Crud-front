import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'https://cruduser-api-1.onrender.com/api/users'

function App() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [editId, setEditId] = useState(null)

  const getUsers = async () => {
    try {
      const response = await axios.get(API_URL)

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : response.data.users || []
      )
    } catch (error) {
      console.log('Error fetching users:', error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userData = {
      name,
      email,
      age: Number(age)
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, userData)
        alert('User updated successfully!')
      } else {
        await axios.post(API_URL, userData)
        alert('User created successfully!')
      }

      setName('')
      setEmail('')
      setAge('')
      setEditId(null)

      await getUsers()
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (user) => {
    setEditId(user._id)
    setName(user.name)
    setEmail(user.email)
    setAge(String(user.age))
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this user?'
    )

    if (!confirmDelete) return

    try {
      await axios.delete(`${API_URL}/${id}`)
      alert('User deleted successfully!')
      await getUsers()
    } catch (error) {
      console.log(error)
      alert(error.response?.data?.message || 'Unable to delete user')
    }
  }

  const handleCancel = () => {
    setName('')
    setEmail('')
    setAge('')
    setEditId(null)
  }

  return (
    <div>
      <h1>User Management</h1>

      <h2>{editId ? 'Edit User' : 'Add New User'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          min="1"
          required
        />

        <br />
        <br />

        <button type="submit">
          {editId ? 'Update User' : 'Add User'}
        </button>

        {editId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <h2>All Users</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && <p>No users found.</p>}
    </div>
  )
}

export default App
