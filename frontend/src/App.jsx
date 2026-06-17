import Navbar from './components/Navbar'
import Home from './sections/Home'
import About from './sections/About'

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
      <Section id="projects" label="Projects" />
      <Section id="education" label="Education" />
      <Section id="experience" label="Experience" />
      <Section id="skills" label="Skills" />
      <Section id="certificates" label="Certificates" />
      <Section id="contact" label="Contact" />
    </main>
  )
}

export default App