import React from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import MovieList from './components/MovieList/MovieList'

function App() {
  return (
    <div className='app'>
      <Navbar />
      <MovieList />
    </div>
  )
}

export default App