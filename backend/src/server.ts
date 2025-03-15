// Create your server
import express, {Request, Response} from 'express'
import cookieSession from 'cookie-session'
import userRouter from './routes/user.routes'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express();

// Middleware
const SIGN_KEY = process.env.COOKIE_SIGN_KEY
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY
if (!SIGN_KEY || !ENCRYPT_KEY) {
  throw new Error("Missing cookie keys!")
}
app.use(cookieSession({
  name: 'session',
  keys: [
    SIGN_KEY,
    ENCRYPT_KEY
  ],
  maxAge: 5 * 60 * 1000
}))
app.use(cors({
    origin: 'http://localhost:4321', // Astro port
    credentials: true // allow cookies
}))  
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', userRouter)


app.use((req: Request, res: Response) => {
    res.status(404).send("Page not found!")
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`)
})