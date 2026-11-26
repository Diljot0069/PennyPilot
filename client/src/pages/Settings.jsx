
import { useEffect, useState } from 'react'
import './Settings.css'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('pennypilot-user') || '{}')
  } catch {
    return {}
  }
}

const getPreferences = () => {
  const defaults = {
    budgetAlerts: true,
    transactionReminders: true,
  }

  try {
    return {
      ...defaults,
      ...JSON.parse(localStorage.getItem('pennypilot-preferences') || '{}'),
    }
  } catch {
    return defaults
  }
}

const Settings = ({ isDarkMode, onThemeChange }) => {
  const [user] = useState(getStoredUser)
  const [preferences, setPreferences] = useState(getPreferences)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem(
      'pennypilot-preferences',
      JSON.stringify(preferences)
    )
  }, [preferences])

  const updatePreference = (key) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: !previous[key],
    }))

    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const initials = (user.name || 'User')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="settings-page">
      <header className="settings-heading">
        <div>
          <span className="settings-eyebrow">YOUR WORKSPACE</span>
          <h1>Settings</h1>
          <p>Manage your account and personalize your experience.</p>
        </div>

        <div className="settings-save-status" aria-live="polite">
          <span className="settings-status-dot" />
          {saved ? 'Preferences saved' : 'Your workspace'}
        </div>
      </header>

      <div className="settings-layout">
        <main className="settings-main">

          {/* PERSONAL INFORMATION */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-icon profile-icon">01</div>
              <div>
                <h2>Personal information</h2>
                <p>Your PennyPilot account details</p>
              </div>
            </div>

            <div className="profile-banner">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-identity">
                <strong>{user.name || 'PennyPilot User'}</strong>
                <span>{user.email || 'No email available'}</span>
              </div>
              <span className="profile-badge">ACCOUNT</span>
            </div>

            <div className="settings-profile-fields">
              <div className="settings-field">
                <span>FULL NAME</span>
                <strong>{user.name || 'Not available'}</strong>
              </div>

              <div className="settings-field">
                <span>EMAIL ADDRESS</span>
                <strong>{user.email || 'Not available'}</strong>
              </div>

              <p className="settings-helper">
                Your account information is managed through your registered
                PennyPilot account.
              </p>
            </div>
          </section>

          {/* NOTIFICATIONS */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-icon notification-icon">02</div>
              <div>
                <h2>Notifications</h2>
                <p>Choose which reminders you want enabled</p>
              </div>
            </div>

            <div className="settings-options">
              <div className="settings-option">
                <div className="option-icon">₹</div>
                <div className="option-copy">
                  <strong>Budget alerts</strong>
                  <span>
                    Receive alerts when spending approaches your budget limit.
                  </span>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={preferences.budgetAlerts}
                    onChange={() => updatePreference('budgetAlerts')}
                  />
                  <span className="switch-track" />
                  <span className="sr-only">Enable budget alerts</span>
                </label>
              </div>

              <div className="settings-option">
                <div className="option-icon">↻</div>
                <div className="option-copy">
                  <strong>Transaction reminders</strong>
                  <span>
                    Keep track of recurring payments and financial entries.
                  </span>
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={preferences.transactionReminders}
                    onChange={() => updatePreference('transactionReminders')}
                  />
                  <span className="switch-track" />
                  <span className="sr-only">
                    Enable transaction reminders
                  </span>
                </label>
              </div>
            </div>

            <p className="settings-helper">
              These preferences are saved locally. Email delivery and
              scheduled reminders require backend notification services.
            </p>
          </section>

          {/* GLOBAL APPEARANCE */}
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-icon appearance-icon">03</div>
              <div>
                <h2>Appearance</h2>
                <p>Customize the look of your entire workspace</p>
              </div>
            </div>

            <div className="settings-option">
              <div className="option-icon">◐</div>

              <div className="option-copy">
                <strong>Dark appearance</strong>
                <span>
                  Apply a premium dark theme across your entire PennyPilot
                  application.
                </span>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={() => onThemeChange(!isDarkMode)}
                />
                <span className="switch-track" />
                <span className="sr-only">Enable dark appearance</span>
              </label>
            </div>
          </section>
        </main>

        {/* SIDE PANEL */}
        <aside className="settings-aside">
          <div className="settings-aside-card">
            <span className="aside-kicker">PENNYPILOT</span>
            <div className="aside-brand-mark">P.</div>

            <h3>
              Better habits.
              <br />
              Better finances.
            </h3>

            <p>
              A clearer view of your money starts with understanding
              how you manage it.
            </p>

            <div className="aside-divider" />

            <div className="aside-detail">
              <span>WORKSPACE</span>
              <strong>Personal Finance</strong>
            </div>

            <div className="aside-detail">
              <span>CURRENCY</span>
              <strong>Indian Rupee · INR</strong>
            </div>
          </div>

          <div className="settings-version">
            <span className="settings-status-dot" />
            PennyPilot · Personal Finance
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Settings
