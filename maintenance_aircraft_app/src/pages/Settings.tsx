import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AlertCircle, CheckCircle, Moon, Sun, Bell, Database, Lock, RefreshCw } from 'lucide-react';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  const handleSync = () => {
    setSyncStatus('syncing');
    // Simulate API sync
    setTimeout(() => {
      setSyncStatus('success');
      // Reset after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Configure application preferences and connections</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Application Settings">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {darkMode ? <Moon size={20} className="mr-3 text-blue-500" /> : <Sun size={20} className="mr-3 text-amber-500" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable dark theme for low-light environments</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell size={20} className="mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for maintenance updates</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <RefreshCw size={20} className="mr-3 text-blue-500" />
                <div>
                  <p className="font-medium">Auto Synchronization</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically sync maintenance data</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={autoSync} onChange={() => setAutoSync(!autoSync)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>
        
        <Card title="Database Settings">
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <Database size={20} className="mr-3 text-teal-500" />
              <h3 className="font-medium">Vector Database Connection</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md flex items-center">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2" />
                <p className="text-sm text-green-700 dark:text-green-300">Connected to QuadrantCloud Vector DB</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Synchronized:</p>
                <p className="font-medium">Today at 14:32</p>
              </div>
              
              <Button
                onClick={handleSync}
                isLoading={syncStatus === 'syncing'}
                rightIcon={syncStatus === 'success' ? <CheckCircle size={16} /> : <RefreshCw size={16} />}
                className={syncStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {syncStatus === 'syncing' 
                  ? 'Synchronizing...' 
                  : syncStatus === 'success' 
                    ? 'Synchronized!' 
                    : 'Sync Database'}
              </Button>
            </div>
          </div>
        </Card>
        
        <Card title="API Connections">
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <Lock size={20} className="mr-3 text-teal-500" />
              <h3 className="font-medium">GroqCloud API Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <Input
                label="API Key"
                type={apiKeyVisible ? "text" : "password"}
                value="grq_0123456789abcdefghijklmnopqrstuvwxyz"
                readOnly
                rightElement={
                  <button
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {apiKeyVisible ? "Hide" : "Show"}
                  </button>
                }
              />
              
              <Input
                label="Model"
                value="llama-3-8b-instruct"
                readOnly
              />
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md flex items-center">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400 mr-2" />
                <p className="text-sm text-green-700 dark:text-green-300">API Connection Verified</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card title="Maintenance Log Settings">
          <div className="space-y-6">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md">
              <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Maintenance Log Retention Policy
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  Logs are currently set to be retained for 5 years. Update your retention policy to comply with your organization's requirements.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Log Retention Period
                </label>
                <select
                  className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm h-10 text-sm w-full pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>1 year</option>
                  <option>3 years</option>
                  <option selected>5 years</option>
                  <option>7 years</option>
                  <option>10 years</option>
                  <option>Indefinite</option>
                </select>
              </div>
              
              <div>
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto-Archive Old Logs
                </label>
                <select
                  className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm h-10 text-sm w-full pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Never</option>
                  <option>After 6 months</option>
                  <option selected>After 1 year</option>
                  <option>After 2 years</option>
                </select>
              </div>
            </div>
            
            <Button variant="outline">Save Settings</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;