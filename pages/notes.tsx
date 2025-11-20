import React from 'react'
import NotesPage from '../src/modules/notes'
import { useAuth } from '../src/context/AuthContext';
import RequireAuth from '../src/modules/auth/RequireAuth';
const notes = () => {
   
  return (
    <div>
  <RequireAuth>
  <NotesPage />
  </RequireAuth>
    
   

    </div>
  )
}

export default notes