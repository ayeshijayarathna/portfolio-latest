import Navbar from './components/Navbar'
import Home from './sections/Home'
import About from './sections/About'
import Education from './sections/Education'
import Certificates from './sections/Certificates'
import Projects from './sections/Projects'

const Section = ({ id, label }) => (
  <section id={id} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', opacity: 0.2 }}>{label}</p>
  </section>
)

function App() {
  return (
    <main>
      <Navbar />
      <Home />
      <About />
      <Education />
      <Certificates />
      <Section id="experience" label="Experience" />
      <Projects />
      <Section id="skills" label="Skills" />
      <Section id="contact" label="Contact" />
    </main>
  )
}

export default App