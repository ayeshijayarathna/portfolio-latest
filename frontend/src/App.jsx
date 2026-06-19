import Navbar from './components/Navbar'
import Home from './sections/Home'
import About from './sections/About'
import Education from './sections/Education'
import Certificates from './sections/Certificates'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Contact from './sections/Contact'

function App() {
  return (
    <main>
      <Navbar />
      <Home />
      <About />
      <Education />
      <Certificates />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </main>
  )
}

export default App