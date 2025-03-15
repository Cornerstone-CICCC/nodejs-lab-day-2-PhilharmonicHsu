import { Request, Response } from 'express'
import userModel from '../models/user.model'
import { User } from '../types/user'

/**
 * Get all users
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Returns list of users.
 */
const getUsers = (req: Request, res: Response) => {
  const users = userModel.findAll()

  res.status(200).json(users)
}

/**
 * Get user by ID
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Returns one user.
 */
const getUserByUsername = (req: Request, res: Response) => {
    if (req.session && req.session.username) {
        const user = userModel.findByUsername(req.session.username)

        res.status(200).json(user)
    }

    res.status(404).send('User not found!')
}

/**
 * Add new user
 * 
 * @param {Request<{ id: string}>} req
 * @param {Response} res
 * @returns {void} Returns newly created user.
 */
const addUser = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
  const { username, password, firstname, lastname } = req.body
  if (!username || !password) {
    res.status(500).json({ error: 'Username/password is empty!' })

    return
  }

  const user = await userModel.create({ username, password, firstname, lastname })
  if (!user) {
    res.status(409).json({ error: 'Username is taken!' })

    return
  }

  res.status(201).json(user)
}

/**
 * Login user
 * 
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Returns cookie and redirect.
 */
const loginUser = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
  const { username, password } = req.body
  if (!username || !password) {
    res.status(500).send("Username/password is missing!")

    return
  }
  const user = await userModel.login(username, password)

  if (!user) {
    res.status(500).send("Login details are incorrect!")

    return
  }

  if (req.session) {
    req.session.isLoggedIn = true
    req.session.username = user.username
  }

  res.status(200).send("Successfully logged in!")
}

const logout = async (req: Request<{}, {}, Omit<User, 'id'>>, res: Response) => {
    req.session = null
    res.status(200).json({
        content: "Session cookie cleared!"
    })
}

export default {
  getUsers,
  getUserByUsername,
  addUser,
  loginUser,
  logout
}