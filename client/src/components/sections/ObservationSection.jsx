import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Trash2,
  RefreshCw,
  Save,
  Search,
  Sliders,
  LineChart as ChartIcon,
  Check,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { calculateRow, computeTableAverages } from '../../utils/physics';
import { SimulationConeViewer } from '../3d/SimulationConeViewer';

const initialEmptyRows = [
  { id: 1, L: '2.0', D: '1.6' },
  { id: 2, L: '3.0', D: '2.4' },
  { id: 3, L: '4.0', D: '3.2' },
  { id: 4, L: '5.0', D: '4.0' },
  { id: 5, L: '6.0', D: '4.8' }
];

const exampleDataset = [
  { id: 1, L: '2.0', D: '1.6' },
  { id: 2, L: '3.0', D: '2.4' },
  { id: 3, L: '4.0', D: '3.2' },
  { id: 4, L: '5.0', D: '4.0' },
  { id: 5, L: '6.0', D: '4.8' }
];

export function ObservationSection({ onStatsCalculated }) {
  const [rows, setRows] = useState(initialEmptyRows);
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [searchRollNo, setSearchRollNo] = useState('');
  const [savedRecords, setSavedRecords] = useState([]);
  const [saveStatus, setSaveStatus] = useState({ state: 'idle', message: '' });
  const [searchStatus, setSearchStatus] = useState({ state: 'idle', message: '' });

  // Simulation Sliders Mode
  const [simL, setSimL] = useState(4.0);
  const [simD, setSimD] = useState(3.2);

  // Compute table statistics whenever rows change
  const computedStats = computeTableAverages(rows);

  useEffect(() => {
    if (onStatsCalculated) {
      onStatsCalculated({
        rows,
        averageNA: computedStats.averageNA,
        acceptanceAngle: computedStats.acceptanceAngle,
        acceptanceCone: computedStats.acceptanceCone,
        studentName,
        rollNo
      });
    }
  }, [rows, studentName, rollNo, computedStats.averageNA, computedStats.acceptanceAngle]);

  const handleRowChange = (id, field, value) => {
    setRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    const nextId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    const lastRow = rows[rows.length - 1];
    const nextL = lastRow && !isNaN(parseFloat(lastRow.L)) ? (parseFloat(lastRow.L) + 1.0).toFixed(1) : '7.0';
    setRows([...rows, { id: nextId, L: nextL, D: '' }]);
  };

  const handleRemoveRow = (id) => {
    if (rows.length <= 1) return;
    setRows(rows.filter(r => r.id !== id));
  };

  const handleLoadExampleData = () => {
    setRows(exampleDataset.map(item => ({ ...item })));
    setSaveStatus({ state: 'info', message: 'Example data loaded. Note: labeled as Example data.' });
    setTimeout(() => setSaveStatus({ state: 'idle', message: '' }), 4000);
  };

  const handleClearTable = () => {
    setRows([
      { id: 1, L: '2.0', D: '' },
      { id: 2, L: '3.0', D: '' },
      { id: 3, L: '4.0', D: '' },
      { id: 4, L: '5.0', D: '' },
      { id: 5, L: '6.0', D: '' }
    ]);
  };

  // Save observations to MongoDB
  const handleSaveToDatabase = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !rollNo.trim()) {
      setSaveStatus({ state: 'error', message: 'Please provide both Student Name and Roll Number before saving.' });
      return;
    }

    const validReadings = rows
      .filter(r => parseFloat(r.L) > 0 && parseFloat(r.D) > 0)
      .map(r => ({
        L: parseFloat(r.L),
        D: parseFloat(r.D)
      }));

    if (validReadings.length === 0) {
      setSaveStatus({ state: 'error', message: 'Please enter at least one valid row with positive L and D.' });
      return;
    }

    setSaveStatus({ state: 'loading', message: 'Saving observations to MongoDB...' });

    try {
      const res = await axios.post('/api/observations', {
        studentName: studentName.trim(),
        rollNo: rollNo.trim(),
        readings: validReadings
      });

      if (res.data?.success) {
        setSaveStatus({ state: 'success', message: 'Observation record saved successfully to MongoDB.' });
        handleSearchByRollNo(rollNo.trim());
      } else {
        setSaveStatus({ state: 'error', message: res.data?.message || 'Failed to save observation.' });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Server error while saving observation.';
      setSaveStatus({ state: 'error', message: errMsg });
    }
  };

  // Search previous observations by roll number
  const handleSearchByRollNo = async (targetRoll) => {
    const roll = targetRoll || searchRollNo.trim();
    if (!roll) {
      setSearchStatus({ state: 'error', message: 'Enter a roll number to search.' });
      return;
    }

    setSearchStatus({ state: 'loading', message: 'Querying records...' });
    try {
      const res = await axios.get(`/api/observations?rollNo=${encodeURIComponent(roll)}`);
      if (res.data?.success) {
        setSavedRecords(res.data.data);
        if (res.data.data.length === 0) {
          setSearchStatus({ state: 'info', message: `No prior observations found for roll number ${roll}.` });
        } else {
          setSearchStatus({ state: 'success', message: `Found ${res.data.data.length} record(s) for ${roll}.` });
        }
      }
    } catch (err) {
      setSearchStatus({ state: 'error', message: 'Failed to retrieve records from database.' });
    }
  };

  // Delete an observation record
  const handleDeleteRecord = async (recordId) => {
    try {
      const res = await axios.delete(`/api/observations/${recordId}`);
      if (res.data?.success) {
        setSavedRecords(prev => prev.filter(r => r._id !== recordId));
        setSearchStatus({ state: 'success', message: 'Observation record deleted successfully.' });
      }
    } catch (err) {
      setSearchStatus({ state: 'error', message: 'Error deleting observation record.' });
    }
  };

  // Load a saved record into current table
  const handleLoadRecordIntoTable = (record) => {
    setStudentName(record.studentName);
    setRollNo(record.rollNo);
    const newRows = record.readings.map((r, i) => ({
      id: i + 1,
      L: String(r.L),
      D: String(r.D)
    }));
    setRows(newRows);
    setSaveStatus({ state: 'success', message: `Loaded observation for ${record.studentName} (${record.rollNo}).` });
  };

  // Prepare chart data (D vs L)
  const chartData = rows
    .filter(r => parseFloat(r.L) > 0 && parseFloat(r.D) > 0)
    .map(r => ({
      L: parseFloat(r.L),
      D: parseFloat(r.D)
    }))
    .sort((a, b) => a.L - b.L);

  return (
    <section id="observations" className="py-12 border-b border-borderline">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-charcoal-900 tracking-tight">
          6. Observation Table and Simulation
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Record distance L and spot diameter D. All derived columns are automatically calculated.
        </p>
      </div>

      <div className="space-y-8">
        {/* Table Container Card */}
        <div className="lab-card p-6 bg-surface border border-borderline">
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-borderline gap-3 mb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-charcoal-900">
                Observation Table (Minimum 5 Readings)
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleLoadExampleData}
                className="lab-btn-secondary text-xs"
                title="Populate table with verified sample lab readings"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                Load example data (Example data)
              </button>

              <button
                type="button"
                onClick={handleClearTable}
                className="lab-btn-secondary text-xs"
              >
                Clear table
              </button>

              <button
                type="button"
                onClick={handleAddRow}
                className="lab-btn-primary text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Row
              </button>
            </div>
          </div>

          {/* Status Alert Banner */}
          {saveStatus.message && (
            <div
              className={`mb-4 p-3 rounded text-xs flex items-center gap-2 border font-mono ${
                saveStatus.state === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : saveStatus.state === 'error'
                  ? 'bg-laser-light text-laser border-red-300'
                  : 'bg-slate-50 text-charcoal-800 border-borderline'
              }`}
            >
              {saveStatus.state === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-laser shrink-0" />
              )}
              <span>{saveStatus.message}</span>
            </div>
          )}

          {/* Editable Observation Table */}
          <div className="overflow-x-auto border border-borderline rounded">
            <table className="w-full text-left lab-table border-collapse">
              <thead>
                <tr>
                  <th className="w-12 text-center">S.No</th>
                  <th className="min-w-[110px]">L (cm)</th>
                  <th className="min-w-[110px]">D (cm)</th>
                  <th className="min-w-[100px]">D/2 (cm)</th>
                  <th className="min-w-[140px]">&radic;(L&sup2; + (D/2)&sup2;) (cm)</th>
                  <th className="min-w-[90px]">NA</th>
                  <th className="min-w-[100px]">&theta; (degrees)</th>
                  <th className="w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const calc = calculateRow(row.L, row.D);
                  const isInvalid = (!calc.isValid && row.D !== '') || (!calc.isValid && row.L !== '');

                  return (
                    <tr key={row.id} className={isInvalid ? 'bg-red-50/50' : ''}>
                      <td className="text-center font-mono font-semibold text-charcoal-600">
                        {index + 1}
                      </td>

                      {/* Distance L input */}
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={row.L}
                          onChange={e => handleRowChange(row.id, 'L', e.target.value)}
                          placeholder="e.g. 4.0"
                          className="w-full px-2 py-1 bg-white border border-borderline rounded text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </td>

                      {/* Spot Diameter D input */}
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={row.D}
                          onChange={e => handleRowChange(row.id, 'D', e.target.value)}
                          placeholder="e.g. 3.2"
                          className="w-full px-2 py-1 bg-white border border-borderline rounded text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </td>

                      {/* D / 2 */}
                      <td className="font-mono text-charcoal-700">
                        {calc.halfD !== '' ? calc.halfD : '-'}
                      </td>

                      {/* Hypotenuse */}
                      <td className="font-mono text-charcoal-700">
                        {calc.hypotenuse !== '' ? calc.hypotenuse : '-'}
                      </td>

                      {/* NA */}
                      <td className="font-mono font-semibold text-primary">
                        {calc.NA !== '' ? calc.NA : '-'}
                      </td>

                      {/* Theta */}
                      <td className="font-mono text-charcoal-800">
                        {calc.theta !== '' ? `${calc.theta}°` : '-'}
                      </td>

                      {/* Remove Button */}
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          disabled={rows.length <= 1}
                          className="p-1 text-charcoal-400 hover:text-laser disabled:opacity-30 transition-colors"
                          title="Remove row"
                          aria-label={`Remove row ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-charcoal-500 font-mono">
            <span>Validation: Distance L and Diameter D must be positive values (&gt; 0).</span>
            <span>Total rows: {rows.length}</span>
          </div>

          {/* Student Info and MongoDB Save Section */}
          <form onSubmit={handleSaveToDatabase} className="mt-6 pt-5 border-t border-borderline">
            <h4 className="font-bold text-sm text-charcoal-900 mb-3 flex items-center gap-2">
              <Save className="w-4 h-4 text-primary" />
              Save Observations to MongoDB Database
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-1.5 bg-white border border-borderline rounded text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  placeholder="e.g. 21BCE1042"
                  className="w-full px-3 py-1.5 bg-white border border-borderline rounded text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saveStatus.state === 'loading'}
                  className="lab-btn-primary w-full text-xs h-[34px]"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save to Database
                </button>
              </div>
            </div>
            <p className="text-[11px] text-charcoal-500">
              Note: Data is saved to MongoDB with student name and roll number. No account or password required. Recomputes NA on server.
            </p>
          </form>

          {/* Search Previous Readings by Roll Number */}
          <div className="mt-5 pt-4 border-t border-borderline">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm text-charcoal-900">
                  Search &amp; Load Previous Observations by Roll Number
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchRollNo}
                  onChange={e => setSearchRollNo(e.target.value)}
                  placeholder="Enter Roll Number"
                  className="px-2.5 py-1 bg-white border border-borderline rounded text-xs font-mono w-40"
                />
                <button
                  type="button"
                  onClick={() => handleSearchByRollNo()}
                  className="lab-btn-secondary text-xs py-1 px-2.5"
                >
                  Search
                </button>
              </div>
            </div>

            {searchStatus.message && (
              <p className="text-xs font-mono text-charcoal-600 mb-2">
                {searchStatus.message}
              </p>
            )}

            {savedRecords.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto border border-borderline rounded p-2 bg-slate-50">
                {savedRecords.map(rec => (
                  <div
                    key={rec._id}
                    className="p-2.5 bg-white border border-borderline rounded flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-charcoal-900">{rec.studentName}</span>
                      <span className="ml-2 font-mono text-charcoal-500">({rec.rollNo})</span>
                      <span className="ml-3 font-mono text-primary">Avg NA: {rec.averageNA}</span>
                      <span className="ml-2 font-mono text-charcoal-600">&theta;0: {rec.acceptanceAngle}°</span>
                      <span className="ml-2 text-charcoal-400 text-[11px]">
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadRecordIntoTable(rec)}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Load into Table
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRecord(rec._id)}
                        className="text-laser hover:text-red-700 p-1"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Simulation Mode and Graph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulation Mode with 3D Light Cone */}
          <div className="lg:col-span-6 lab-card p-6 bg-surface border border-borderline flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-borderline mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-charcoal-900">
                    Simulation Mode (Dynamic 3D Light Cone)
                  </h3>
                </div>
                <span className="text-xs font-mono text-primary font-semibold">
                  NA = {(simD / 2 / Math.sqrt(simL * simL + (simD / 2) * (simD / 2))).toFixed(3)}
                </span>
              </div>

              <div className="mb-4">
                <SimulationConeViewer L={simL} D={simD} />
              </div>

              {/* Sliders for L and D */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-charcoal-700 mb-1">
                    <label htmlFor="sim-l-slider">Distance L (cm):</label>
                    <span className="font-mono text-primary">{Number(simL).toFixed(1)} cm</span>
                  </div>
                  <input
                    id="sim-l-slider"
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={simL}
                    onChange={e => setSimL(parseFloat(e.target.value))}
                    className="w-full accent-primary h-2 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-charcoal-500 font-mono mt-0.5">
                    <span>1.0 cm</span>
                    <span>10.0 cm</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-charcoal-700 mb-1">
                    <label htmlFor="sim-d-slider">Spot Diameter D (cm):</label>
                    <span className="font-mono text-primary">{Number(simD).toFixed(1)} cm</span>
                  </div>
                  <input
                    id="sim-d-slider"
                    type="range"
                    min="0.8"
                    max="8.0"
                    step="0.1"
                    value={simD}
                    onChange={e => setSimD(parseFloat(e.target.value))}
                    className="w-full accent-primary h-2 bg-slate-200 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-charcoal-500 font-mono mt-0.5">
                    <span>0.8 cm</span>
                    <span>8.0 cm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-borderline text-[11px] text-charcoal-500 font-mono">
              Adjust sliders to observe the conical beam expansion onto the concentric target rings in real time.
            </div>
          </div>

          {/* Recharts Graph: Spot Diameter D versus Distance L */}
          <div className="lg:col-span-6 lab-card p-6 bg-surface border border-borderline flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-borderline mb-4">
                <div className="flex items-center gap-2">
                  <ChartIcon className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-charcoal-900">
                    Experimental Graph: Spot Diameter D versus Distance L
                  </h3>
                </div>
                <span className="text-xs font-mono text-charcoal-500">
                  {chartData.length} Data Points
                </span>
              </div>

              {chartData.length > 0 ? (
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={chartData}
                      margin={{ top: 10, right: 20, bottom: 25, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="L"
                        name="Distance L"
                        unit=" cm"
                        stroke="#475569"
                        fontSize={11}
                        label={{ value: 'Distance L (cm)', position: 'insideBottom', offset: -15, fontSize: 11, fill: '#475569' }}
                      />
                      <YAxis
                        dataKey="D"
                        name="Spot Diameter D"
                        unit=" cm"
                        stroke="#475569"
                        fontSize={11}
                        label={{ value: 'Spot Diameter D (cm)', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: '#475569' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#cbd5e1',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontFamily: 'JetBrains Mono'
                        }}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter' }} />
                      <Line
                        type="monotone"
                        dataKey="D"
                        stroke="#0369a1"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#dc2626' }}
                        activeDot={{ r: 6 }}
                        name="Observed Spot Diameter D (cm)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-72 flex flex-col items-center justify-center bg-slate-50 border border-borderline rounded text-xs text-charcoal-500 font-mono">
                  <p>Enter valid positive readings in the table above to generate the D vs L graph.</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-borderline text-[11px] text-charcoal-600 font-mono">
              Theoretical relation: D = 2 &times; L &times; tan(&theta;0). The linear slope confirms a constant divergence angle.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
