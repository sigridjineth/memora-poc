import React from 'react';
import { Settings as SettingsIcon, Bell, Palette, ShieldCheck, UserCircle } from 'lucide-react';

const SettingsSection = ({ title, icon, children }) => {
  const IconComponent = icon || SettingsIcon;
  return (
    <div className="bg-navy-medium p-6 rounded-lg shadow-lg mb-8">
      <div className="flex items-center mb-4">
        <IconComponent size={24} className="text-accent-purple mr-3" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const ToggleSetting = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-dark last:border-b-0">
    <div>
      <p className="text-gray-light">{label}</p>
      {description && <p className="text-sm text-gray-medium">{description}</p>}
    </div>
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-purple ${
        enabled ? 'bg-accent-purple' : 'bg-gray-dark'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);


const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true); // Assuming default is dark

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-gray-light">
      <header className="mb-10">
        <div className="flex items-center mb-2">
          <SettingsIcon size={32} className="mr-3 text-accent-purple" />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-gray-medium">Manage your application preferences and account settings.</p>
      </header>

      <SettingsSection title="Account" icon={UserCircle}>
        <div className="py-3 border-b border-gray-dark">
          <p className="text-gray-light">Username</p>
          <p className="text-white font-medium">DemoUser123</p>
        </div>
        <div className="py-3">
          <p className="text-gray-light">Email</p>
          <p className="text-white font-medium">demo.user@example.com</p>
          <button className="text-sm text-accent-blue hover:underline mt-1">Change Email</button>
        </div>
        <button className="mt-2 text-sm text-red-negative hover:underline">Delete Account</button>
      </SettingsSection>

      <SettingsSection title="Notifications" icon={Bell}>
        <ToggleSetting 
          label="Email Notifications" 
          description="Receive updates and alerts via email."
          enabled={notificationsEnabled} 
          onToggle={() => setNotificationsEnabled(!notificationsEnabled)} 
        />
        <ToggleSetting 
          label="In-App Notifications" 
          description="Show notifications directly within the app."
          enabled={true} // Example: always enabled or controlled elsewhere
          onToggle={() => alert("In-app notification toggle clicked!")} 
        />
      </SettingsSection>

      <SettingsSection title="Appearance" icon={Palette}>
        <ToggleSetting 
          label="Dark Mode" 
          description="Toggle between light and dark themes."
          enabled={darkMode} 
          onToggle={() => {
            setDarkMode(!darkMode);
            // In a real app, you'd also toggle a class on the body or use a theme provider
            alert(`Dark mode ${!darkMode ? 'enabled' : 'disabled'}. (UI update not implemented in this placeholder)`);
          }} 
        />
         <div className="py-3">
          <p className="text-gray-light mb-1">Accent Color</p>
          <div className="flex space-x-2">
            {['#8a63d2', '#e91e63', '#2196f3', '#2da44e'].map(color => (
              <button 
                key={color} 
                style={{ backgroundColor: color }} 
                className="w-8 h-8 rounded-full border-2 border-gray-dark focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => alert(`Accent color ${color} selected. (UI update not implemented)`)}
              />
            ))}
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Security & Privacy" icon={ShieldCheck}>
        <button className="w-full text-left py-3 text-gray-light hover:bg-gray-dark px-2 rounded-md transition-colors">Change Password</button>
        <button className="w-full text-left py-3 text-gray-light hover:bg-gray-dark px-2 rounded-md transition-colors">Two-Factor Authentication (2FA)</button>
        <button className="w-full text-left py-3 text-gray-light hover:bg-gray-dark px-2 rounded-md transition-colors">Manage Connected Devices</button>
        <button className="w-full text-left py-3 text-gray-light hover:bg-gray-dark px-2 rounded-md transition-colors">Download Your Data</button>
      </SettingsSection>
      
    </div>
  );
};

export default Settings;
