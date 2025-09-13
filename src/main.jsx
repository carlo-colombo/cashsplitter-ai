import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'
import { StateProvider } from './context/StateContext';

render(<StateProvider><App /></StateProvider>, document.getElementById('app'))
