import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

import Navbar from './components/Navbar'
import Home from './sections/Home'
import About from './sections/About'
import Education from './sections/Education'
import Certificates from './sections/Certificates'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Contact from './sections/Contact'

import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import ProtectedRoute from './admin/ProtectedRoute'

import TechBackground from './components/TechBackground'
import CustomCursor from './components/CustomCursor'

function Portfolio() {
  return (
    <>
      <TechBackground />
      <CustomCursor />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Home />
        <About />
        <Education />
        <Certificates />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App