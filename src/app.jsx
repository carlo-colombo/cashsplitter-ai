import { Router } from 'preact-router';
import { useAppState } from './context/StateContext';
import { CreateGroupForm } from './components/CreateGroupForm';
import { GroupList } from './components/GroupList';
import { GroupView } from './components/GroupView';
import './app.css';

export function App({ history }) {
  const { handleExport, handleImport } = useAppState();

  return (
    <Router history={history}>
      <div path="/" class="container">
        <div class="columns is-centered">
          <div class="column is-half">

            <section class="section">
              <h1 class="title">Cashsplitter</h1>
              <p class="subtitl
                Create groups and split expenses with your friends.
              </p>
              <div class="buttons">
                <button class="button is-primary" onClick={handleExport}>
                  Export Data
                </button>
                <div class="file is-primary">
                  <label class="file-label">
                    <input class="file-input" type="file" name="resume" onChange={handleImport} accept=".json" />
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload"></i>
                      </span>
                      <span class="file-label">
                        Import Data
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </section>
            <section class="py-4">
              <h2 class="title is-4 mb-2">My Groups</h2>
              <CreateGroupForm />
              <div class="mt-2">
                <GroupList />
              </div>
            </section>
          </div>
        </div>
      </div>
      <GroupView path="/group/:groupId" />
    </Router>
  );
}
