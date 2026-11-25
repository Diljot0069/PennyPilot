const Settings = () => {
  return (
    <div className="page-section">
      <header className="page-header">
        <div>
          <span className="eyebrow">Preferences</span>
          <h1>Settings</h1>
        </div>
      </header>

      <div className="settings-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Profile</h3>
          </div>
          <div className="settings-list">
            <label>
              Full name
              <input type="text" defaultValue="Diljot Singh" />
            </label>
            <label>
              Email
              <input type="email" defaultValue="singhdiljot175@gmail.com" />
            </label>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Preferences</h3>
          </div>
          <div className="settings-list">
            <label className="checkbox-row inline">
              <input type="checkbox" defaultChecked />
              <span>Enable email budget alerts</span>
            </label>
            <label className="checkbox-row inline">
              <input type="checkbox" defaultChecked />
              <span>Enable recurring transaction reminders</span>
            </label>
            <label className="checkbox-row inline">
              <input type="checkbox" />
              <span>Enable dark mode</span>
            </label>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Settings
