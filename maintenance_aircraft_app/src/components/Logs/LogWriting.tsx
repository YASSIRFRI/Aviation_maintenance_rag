import React, { useState } from "react";
import LogWritingAssistant from "../components/Logs/LogWritingAssistant";
import { MaintenanceLog } from "../types";

const LogWriting = () => {
  const [draftLog, setDraftLog] = useState<Partial<MaintenanceLog>>({
    date: new Date().toISOString().split('T')[0],
    technicianId: 'tech123',
    technicianName: 'Alex Rodriguez',
    status: 'Pending'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDraftLog(prev => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the log to your backend
    console.log("Submitting maintenance log:", draftLog);
    // Reset form or redirect
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create Maintenance Log</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aircraft Model</label>
                  <select
                    name="aircraftModel"
                    value={draftLog.aircraftModel || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Aircraft Model</option>
                    <option value="Boeing 737">Boeing 737</option>
                    <option value="Airbus A320">Airbus A320</option>
                    <option value="Boeing 787">Boeing 787</option>
                    <option value="Airbus A350">Airbus A350</option>
                    <option value="Embraer E190">Embraer E190</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tail Number</label>
                  <input
                    type="text"
                    name="tailNumber"
                    value={draftLog.tailNumber || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={draftLog.category || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Hydraulics">Hydraulics</option>
                    <option value="Avionics">Avionics</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Structural">Structural</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={draftLog.status || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={draftLog.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Action Taken</label>
                <textarea
                  name="action"
                  value={draftLog.action || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parts Used (comma separated)</label>
                  <input
                    type="text"
                    name="parts"
                    value={draftLog.parts?.join(', ') || ''}
                    onChange={(e) => {
                      const partsArray = e.target.value ? e.target.value.split(',').map(p => p.trim()) : [];
                      setDraftLog(prev => ({ ...prev, parts: partsArray }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Spent (minutes)</label>
                  <input
                    type="number"
                    name="timeSpent"
                    value={draftLog.timeSpent || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Maintenance Log
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <LogWritingAssistant
            draftLog={draftLog}
            onSuggestionSelect={(suggestion) => {
              setDraftLog(prev => ({ ...prev, action: suggestion }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LogWriting;