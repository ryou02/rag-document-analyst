import { createContext } from 'react'

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
})

export default AuthContext
