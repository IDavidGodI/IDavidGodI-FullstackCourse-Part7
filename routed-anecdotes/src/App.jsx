import { useEffect } from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Routes, Route, Link } from 'react-router-dom'
import {useField} from "./hooks"

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id} >
          <Link to={`/anecdotes/${anecdote.id}`}>
            {anecdote.content}
          </Link>
        </li>)}
    </ul>
  </div>
)

const Anecdote = ({anecdotes})=>{
  const {id} = useParams()
  const anecdote = anecdotes.find(a=> a.id==id);
  const navigate = useNavigate()
  useEffect(()=>{
    if (!anecdote) {
      navigate("/")
    }
  }, [])
  return (
    <>
    {anecdote &&

      <section style={{border:"solid 2px", padding:"1rem", margin:"1rem"}}>
      
      <h2>{anecdote.content}</h2>
      <p></p>
      <p>Votes: {anecdote.votes}</p>
      <Link to={anecdote.info}>Click here to see more</Link>
      <p style={{color:"#777777"}}>By {anecdote.author}</p>
      </section>
    }
    </>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  
  const content = useField()
  const author = useField()
  const info = useField()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.fieldProps.value,
      author: author.fieldProps.value,
      info: info.fieldProps.value,
      votes: 0
    })
  }

  const resetForm = ()=>{
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...content.fieldProps} />
        </div>
        <div>
          author
          <input name='author' {...author.fieldProps} />
        </div>
        <div>
          url for more info
          <input name='info' {...info.fieldProps} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={resetForm}>reset</button>
      </form>
    </div>
  )

}

const Notificacion = ({text})=>{
  const style = {
    backgroundColor:"#f8f8f8",
    border: "solid 2px",
    borderColor: "#9f9f9f",
    padding: "0.4rem"
  }
  return (
    <div style={style}>
      <p>{text}</p>
    </div>
  )
}

const App = () => {
  
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')
  const navigate = useNavigate()
  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`Anecdote '${anecdote.content}' created`);
    setTimeout(()=>setNotification(null),5000)
    navigate("/")
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
  
  
  return (
    <>
    <div>


        <h1>Software anecdotes</h1>
        {
          notification &&
          <Notificacion text={notification}/>
        }
        <Menu />
        <Routes>
          <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />}/>
          <Route path="anecdotes/:id" element={<Anecdote anecdotes={anecdotes}/>}/>
          <Route path="anecdotes/:id/*" element={<Navigate to="/"/>}/>
          <Route path='/create' element={<CreateNew addNew={addNew} />}/>
          <Route path="/about" element={<About />}/>
          
          
        </Routes>
        <Footer />
    </div>
    </>
  )
}

export default App
