import { useState } from 'preact/hooks';

export function CreateGroupForm({ onGroupCreate }) {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      onGroupCreate(groupName);
      setGroupName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="field has-addons">
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="New group name"
            value={groupName}
            onInput={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div class="control">
          <button class="button is-info" type="submit">
            Create Group
          </button>
        </div>
      </div>
    </form>
  );
}
