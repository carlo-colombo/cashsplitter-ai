import { render } from 'preact'
import './index.css'
import { App } from './app.jsx'
import { StateProvider } from './context/StateContext';
import { createHashHistory } from 'history';

const history = createHashHistory();

render(<StateProvider><App history={history} /></StateProvider>, document.getElementById('app'))
