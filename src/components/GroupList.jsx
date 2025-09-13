import { useAppState } from '../context/StateContext';

export function GroupList() {
  const { groups, handleGroupSelect, handleGroupDelete } = useAppState();

  const handleDeleteClick = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      handleGroupDelete(groupId);
    }
  };

  return (
    <div>
      {groups.map((group) => (
        <div class="box" key={group.id}>
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <p class="title is-5">{group.name}</p>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <button
                  class="button is-link"
                  onClick={() => handleGroupSelect(group)}
                >
                  View
                </button>
              </div>
              <div class="level-item">
                <button
                  class="button is-danger"
                  onClick={() => handleDeleteClick(group.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
