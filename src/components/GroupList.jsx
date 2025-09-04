export function GroupList({ groups, onGroupSelect }) {
  return (
    <div class="list">
      {groups.map((group) => (
        <div class="list-item" key={group.id}>
          <span>{group.name}</span>
          <button
            class="button is-small is-link is-outlined"
            onClick={() => onGroupSelect(group)}
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
}
