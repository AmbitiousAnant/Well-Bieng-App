
import React, { useState } from 'react';
import { UserSettings, Contact } from '../types';
import { Users, Plus, Trash2, Phone, User, Save } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Mentor');

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName,
      phone: newContactPhone,
      relation: newContactRelation
    };

    onUpdateSettings({
      ...settings,
      contacts: [...settings.contacts, newContact]
    });

    setNewContactName('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (id: string) => {
    onUpdateSettings({
      ...settings,
      contacts: settings.contacts.filter(c => c.id !== id)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            <Users className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Trusted Supporters Network</h2>
            <p className="text-sm text-slate-400">
              Add mentors, friends, or family members who should be contacted during a wellness anomaly.
            </p>
          </div>
        </div>

        {/* Contact List */}
        <div className="space-y-4 mb-8">
          {settings.contacts.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/30">
              <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500">No supporters added yet.</p>
              <p className="text-xs text-slate-600">Add trusted contacts below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.contacts.map((contact) => (
                <div key={contact.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 font-bold">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">{contact.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">{contact.relation}</span>
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveContact(contact.id)}
                    className="text-slate-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Contact Form */}
        <form onSubmit={handleAddContact} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Supporter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-600" />
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Dr. Smith"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-600" />
                <input
                  type="tel"
                  required
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  placeholder="+1 (555) ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Role/Relation</label>
              <select
                value={newContactRelation}
                onChange={(e) => setNewContactRelation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
              >
                <option>Mentor</option>
                <option>Therapist</option>
                <option>Family</option>
                <option>Friend</option>
                <option>Partner</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Contact
          </button>
        </form>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Automation Settings</h2>
        <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-700">
          <div>
            <div className="font-medium text-slate-200">Automated Emergency Protocols</div>
            <div className="text-sm text-slate-500 mt-1">
              Allow the system to automatically contact 1800-891-4416 and your configured supporters if you are unresponsive during a critical anomaly.
            </div>
          </div>
          <button 
            onClick={() => onUpdateSettings({...settings, allowAutomatedAlerts: !settings.allowAutomatedAlerts})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allowAutomatedAlerts ? 'bg-emerald-500' : 'bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${settings.allowAutomatedAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
