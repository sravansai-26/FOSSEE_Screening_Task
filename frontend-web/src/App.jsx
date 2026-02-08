import React, { useState, useEffect } from 'react';
import { uploadCSV, getHistory } from './apiService';
import { Bar, Pie } from 'react-chartjs-2';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion'; 
/* eslint-enable no-unused-vars */
import { 
  Upload, Database, BarChart3, Activity, 
  FlaskConical, ShieldCheck, Zap, Github, PieChart as PieIcon, History
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const App = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistory();
      setHistory(res.data);
    } catch {
      console.error("History fetch failed");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const response = await uploadCSV(file);
      setData(response.data.raw_data);
      setSummary(response.data.summary);
      fetchHistory(); 
    } catch {
      alert("Analysis failed. Ensure the Django server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FlaskConical className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ChemVisualizer</h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">FOSSEE IIT Bombay</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#hero" className="hover:text-blue-600 transition-colors">Overview</a>
            <a href="#analyze" className="hover:text-blue-600 transition-colors">Analyze</a>
            <a 
              href="https://github.com/sravansai-26/FOSSEE_Screening_Task" 
              target="_blank" 
              rel="noreferrer"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Github size={16} /> Source Code
            </a>
          </nav>
        </div>
      </header>

      <section id="hero" className="pt-16 pb-20 px-6 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
              Screening Task 2026
            </span>
            <h2 className="text-5xl md:text-6xl font-black mt-6 mb-6 leading-tight">
              Hybrid Chemical <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Analytics Dashboard
              </span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10">
              High-performance parsing and visualization engine for industrial equipment data. 
              Bridging the gap between Web and Desktop interfaces.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="analyze" className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload size={20} className="text-blue-600" /> Upload CSV
              </h3>
              <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 text-center group hover:border-blue-400 transition-colors">
                <input type="file" id="file-upload" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Activity className="mx-auto text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
                  <p className="text-sm font-semibold text-slate-600 truncate">{file ? file.name : "Select Dataset"}</p>
                </label>
              </div>
              <button 
                onClick={handleUpload}
                disabled={loading || !file}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
              >
                {loading ? "Processing..." : "Generate Analysis"}
              </button>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <History size={18} className="text-slate-400" /> Recent Uploads
              </h3>
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-700 truncate w-32">{item.filename}</p>
                      <p className="text-[10px] text-slate-400">{item.date}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                      {item.total} rows
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {summary ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <StatBox label="Total Count" value={summary.total_count} color="blue" />
                    <StatBox label="Avg Pressure" value={`${summary.avg_pressure} bar`} color="emerald" />
                    <StatBox label="Avg Temp" value={`${summary.avg_temperature}°C`} color="orange" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <PieIcon size={16} /> Type Distribution
                      </h4>
                      <div className="h-64 flex justify-center">
                        <Pie 
                          data={{
                            labels: Object.keys(summary.type_distribution),
                            datasets: [{
                              data: Object.values(summary.type_distribution),
                              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
                              borderWidth: 0
                            }]
                          }}
                          options={{ maintainAspectRatio: false }}
                        />
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <BarChart3 size={16} /> Metrics Overview
                      </h4>
                      <div className="h-64">
                        <Bar 
                          data={{
                            labels: ['Flow', 'Press', 'Temp'],
                            datasets: [{
                              label: 'Averages',
                              data: [summary.avg_flowrate, summary.avg_pressure, summary.avg_temperature],
                              backgroundColor: '#3b82f6',
                              borderRadius: 8
                            }]
                          }}
                          options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          {['Name', 'Type', 'Flowrate', 'Pressure'].map(h => (
                            <th key={h} className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-tighter">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {data.slice(0, 10).map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold">{item['Equipment Name']}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{item.Type}</td>
                            <td className="px-6 py-4 text-sm font-mono text-blue-600">{item.Flowrate}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{item.Pressure}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-slate-100 text-slate-300 p-20">
                  <Database size={48} className="mb-4 opacity-20" />
                  <p className="font-bold text-lg">No analysis data found</p>
                  <p className="text-sm">Upload a CSV to generate real-time metrics</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 border-b border-slate-800 pb-12 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="text-blue-500" />
              <h1 className="text-2xl font-bold">ChemVisualizer</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-sm">
              An open-source screening project developed for the FOSSEE Semester Long Internship 2026 at IIT Bombay.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-center">
            <div className="flex gap-4 mb-4">
              <StatIcon icon={<Zap />} label="React" />
              <StatIcon icon={<ShieldCheck />} label="Django" />
              <StatIcon icon={<Database />} label="SQLite" />
            </div>
            <p className="text-slate-500 text-xs italic">
              Developed by{" "}
              <a 
                href="https://sailyfspot.blogspot.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-slate-300 transition-colors"
              >
                LYFSpot
              </a>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2026 FOSSEE IIT Bombay Screening • Built with 💙 from LYFSpot
        </div>
      </footer>
    </div>
  );
};

const StatIcon = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
    {React.cloneElement(icon, { size: 14 })}
    <span>{label}</span>
  </div>
);

const StatBox = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
    <span className={`text-[10px] font-black uppercase text-${color}-600 tracking-widest mb-1`}>{label}</span>
    <span className="text-2xl font-black">{value}</span>
  </div>
);

export default App;