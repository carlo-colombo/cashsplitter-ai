import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'
import { AppProvider } from './contexts/AppContext.jsx'

render(<AppProvider><App /></AppProvider>, document.getElementById('app'))
