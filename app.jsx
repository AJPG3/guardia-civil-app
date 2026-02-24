<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>GC Master - Academia Guardia Civil</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .btn-active:active { transform: scale(0.96); }
    </style>
</head>
<body class="bg-gray-50">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // Sistema de Iconos SVG Integrado
        const Icon = ({ name, size = 20, className = "" }) => {
            const icons = {
                ShieldAlert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                Trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
                RefreshCcw: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>,
                Star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                Calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                List: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
                LayoutGrid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
                BrainCircuit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.203 2 2 0 0 0 3.44 1.683A5.002 5.002 0 0 0 13 13V5Z"/><path d="M13 13h1"/><path d="M18 13h1"/><path d="M17 13a2 2 0 1 1-4 0h4Z"/><path d="M12 8h1"/></svg>,
                Search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                ChevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
                Gavel: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 13-5 5 2 2 5-5-2-2Z"/><path d="m14.5 2 6.5 6.5-2.5 2.5-6.5-6.5L14.5 2Z"/><path d="m3 21 2-2"/><path d="m6 15 2 2"/></svg>,
                Users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="4"/></svg>,
                Settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
                Home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                AlertCircle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                Zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                Power: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
            };
            return <span className={className}>{icons[name] || icons.ShieldAlert}</span>;
        };

        const apiKey = "AIzaSyBl1TDv5-OIBZGYLTCQ_v4g_oxkJPNs6eg"; 
        const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

        const OFFICIAL_TOPICS = [
            { id: 1, name: "Derechos Humanos", cat: "Jurídicas" },
            { id: 2, name: "Igualdad", cat: "Jurídicas" },
            { id: 3, name: "Prevención de Riesgos Laborales", cat: "Jurídicas" },
            { id: 4, name: "Derecho Constitucional", cat: "Jurídicas" },
            { id: 5, name: "Derecho de la Unión Europea", cat: "Jurídicas" },
            { id: 6, name: "Instituciones Internacionales", cat: "Jurídicas" },
            { id: 7, name: "Derecho Civil", cat: "Jurídicas" },
            { id: 8, name: "Derecho Penal", cat: "Jurídicas" },
            { id: 9, name: "Derecho Procesal Penal", cat: "Jurídicas" },
            { id: 10, name: "Derecho Administrativo", cat: "Jurídicas" },
            { id: 11, name: "Protección de Datos", cat: "Jurídicas" },
            { id: 12, name: "Extranjería e Inmigración", cat: "Jurídicas" },
            { id: 13, name: "Seguridad Pública y Privada", cat: "Jurídicas" },
            { id: 14, name: "Ministerio del Interior y Defensa", cat: "Jurídicas" },
            { id: 15, name: "Fuerzas y Cuerpos de Seguridad", cat: "Jurídicas" },
            { id: 16, name: "Protección Civil", cat: "Socio-Cultural" },
            { id: 17, name: "Desarrollo Sostenible", cat: "Socio-Cultural" },
            { id: 18, name: "Eficiencia Energética", cat: "Socio-Cultural" },
            { id: 19, name: "Tecnologías de la Información", cat: "Técnicas" },
            { id: 20, name: "Estadística", cat: "Técnicas" },
            { id: 21, name: "Topografía", cat: "Técnicas" },
            { id: 22, name: "Automovilismo", cat: "Técnicas" },
            { id: 23, name: "Armamento y Tiro", cat: "Técnicas" },
            { id: 24, name: "Transmisiones", cat: "Técnicas" },
            { id: 25, name: "Lengua Extranjera (Inglés)", cat: "Inglés" }
        ];

        const BLOCKS = [
            { id: 'jur', name: "Bloque Jurídico (1-15)", cat: "Jurídicas", icon: "Gavel", color: "text-blue-600 bg-blue-50" },
            { id: 'soc', name: "Bloque Socio-Cultural (16-18)", cat: "Socio-Cultural", icon: "Users", color: "text-purple-600 bg-purple-50" },
            { id: 'tec', name: "Bloque Técnico (19-24)", cat: "Técnicas", icon: "Settings", color: "text-orange-600 bg-orange-50" }
        ];

        const AUX_TESTS = [
            { id: 'psi', name: "Psicotécnicos", cat: "Auxiliar", icon: "BrainCircuit", color: "text-pink-600 bg-pink-50" },
            { id: 'ort', name: "Ortografía", cat: "Auxiliar", icon: "RefreshCcw", color: "text-cyan-600 bg-cyan-50" },
            { id: 'gra', name: "Gramática", cat: "Auxiliar", icon: "RefreshCcw", color: "text-teal-600 bg-teal-50" },
            { id: 'ing', name: "Inglés Refuerzo", cat: "Inglés", icon: "Star", color: "text-amber-600 bg-amber-50" }
        ];

        const App = () => {
            const [view, setView] = useState('home');
            const [activeTab, setActiveTab] = useState('temas');
            const [questions, setQuestions] = useState([]);
            const [currentIdx, setCurrentIdx] = useState(0);
            const [selectedAns, setSelectedAns] = useState(null);
            const [isAnswered, setIsAnswered] = useState(false);
            const [loading, setLoading] = useState(false);
            const [searchTerm, setSearchTerm] = useState("");
            const [errorBank, setErrorBank] = useState([]);
            const [stats, setStats] = useState({ done: 0, correct: 0 });
            const [currentTitle, setCurrentTitle] = useState("");

            const getMockQuestions = (topic, count = 20) => Array.from({ length: count }, (_, i) => ({
                question: `Pregunta ${i+1} de muestra sobre ${topic}`,
                options: ["Opción Correcta", "Opción Incorrecta B", "Opción Incorrecta C", "Opción Incorrecta D"],
                correct: 0,
                justification: "Introduce tu API Key en la configuración del código para obtener preguntas reales generadas por IA."
            }));

            const fetchQuestions = async (topicName) => {
                setLoading(true);
                setCurrentTitle(topicName);
                
                if (!apiKey) {
                    setTimeout(() => {
                        setQuestions(getMockQuestions(topicName, 20));
                        setView('quiz');
                        setLoading(false);
                    }, 600);
                    return;
                }

                try {
                    const prompt = `Genera un JSON con exactamente 20 preguntas de nivel oposición Guardia Civil sobre: ${topicName}. 
                    Estructura: {"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "correct": 0, "justification": "..."}]}`;
                    
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { responseMimeType: "application/json" }
                        })
                    });

                    const data = await response.json();
                    const text = data.candidates[0].content.parts[0].text;
                    const parsed = JSON.parse(text);
                    setQuestions(parsed.questions.slice(0, 20));
                    setView('quiz');
                } catch (err) {
                    setQuestions(getMockQuestions(topicName, 20));
                    setView('quiz');
                } finally {
                    setLoading(false);
                }
            };

            const startTest = (item) => {
                setCurrentIdx(0);
                setIsAnswered(false);
                setSelectedAns(null);
                setStats({ done: 0, correct: 0 }); // Reset stats for the specific test session

                if (item.id === 'error-review') {
                    if (errorBank.length === 0) return;
                    setQuestions([...errorBank]);
                    setCurrentTitle("Repaso de Errores");
                    setView('quiz');
                } else {
                    fetchQuestions(item.name);
                }
            };

            const handleAnswer = (idx) => {
                if (isAnswered) return;
                setSelectedAns(idx);
                setIsAnswered(true);
                const correct = questions[currentIdx].correct;
                
                const isCorrect = idx === correct;
                setStats(prev => ({
                    done: prev.done + 1,
                    correct: isCorrect ? prev.correct + 1 : prev.correct
                }));

                if (!isCorrect) {
                    // Add to error bank if not already there (simple check by question text)
                    setErrorBank(prev => {
                        if (prev.find(q => q.question === questions[currentIdx].question)) return prev;
                        return [...prev, questions[currentIdx]];
                    });
                } else {
                    // If corrected, remove from error bank
                    setErrorBank(prev => prev.filter(q => q.question !== questions[currentIdx].question));
                }
            };

            const nextQuestion = () => {
                if (currentIdx < questions.length - 1) {
                    setCurrentIdx(prev => prev + 1);
                    setIsAnswered(false);
                    setSelectedAns(null);
                } else {
                    setView('results');
                }
            };

            const finishTest = () => {
                if (confirm("¿Seguro que quieres finalizar el test ahora?")) {
                    setView('results');
                }
            };

            const successRate = stats.done > 0 ? Math.round((stats.correct / stats.done) * 100) : 0;

            if (loading) return (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
                    <div className="animate-bounce mb-4 text-emerald-600">
                        <Icon name="Zap" size={48} />
                    </div>
                    <h2 className="text-xl font-black text-gray-800 uppercase italic">Generando Examen...</h2>
                    <p className="text-gray-400 text-xs mt-2 font-bold uppercase tracking-widest">{currentTitle}</p>
                    <p className="text-[10px] mt-4 text-gray-300 font-bold uppercase tracking-widest">Preparando 20 preguntas</p>
                </div>
            );

            return (
                <div className="min-h-screen bg-gray-50 text-gray-900 pb-10">
                    <header className="bg-[#064d2e] text-white pt-10 pb-12 px-6 rounded-b-[2.5rem] shadow-xl sticky top-0 z-50">
                        <div className="flex justify-between items-center max-w-xl mx-auto">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                                <Icon name="ShieldAlert" className="text-emerald-400" />
                                <h1 className="text-xl font-black italic tracking-tighter uppercase">GC MASTER</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-[8px] font-black opacity-40 uppercase">Efectividad</p>
                                    <p className="text-xl font-black text-emerald-400">{successRate}%</p>
                                </div>
                                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Icon name="Trophy" size={18} className="text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="px-5 -mt-6 max-w-xl mx-auto relative z-10">
                        {view === 'home' && (
                            <div className="space-y-6 animate-in">
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => startTest({id: 'error-review'})} 
                                        className={`p-5 rounded-[2rem] shadow-sm border text-left btn-active transition-colors ${errorBank.length > 0 ? 'bg-white border-red-100' : 'bg-gray-100 border-transparent opacity-50 cursor-not-allowed'}`}
                                    >
                                        <p className="text-[9px] font-black text-red-500 uppercase mb-1">Repaso Fallos</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-black text-gray-800">{errorBank.length}</span>
                                            <Icon name="RefreshCcw" size={16} className="text-red-300" />
                                        </div>
                                    </button>
                                    <button onClick={() => startTest({name: 'Simulacro General Examen Oficial'})} className="bg-[#064d2e] p-5 rounded-[2rem] shadow-lg text-left btn-active">
                                        <p className="text-[9px] font-black text-emerald-400 uppercase mb-1">Simulacro 20</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-black text-white">★</span>
                                            <Icon name="Star" size={16} className="text-yellow-400" />
                                        </div>
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-2 tracking-widest">
                                        <Icon name="Calendar" size={12} /> Exámenes por Año
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['2025', '2024', '2023', '2022'].map(year => (
                                            <button key={year} onClick={() => startTest({name: `Examen Oficial Guardia Civil ${year}`})} className="bg-white text-gray-800 py-4 rounded-2xl font-black text-[10px] shadow-sm border btn-active uppercase">
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                                    {['temas', 'bloques', 'aux'].map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-[#064d2e] text-white shadow-md' : 'text-gray-400'}`}>
                                            <Icon name={tab === 'temas' ? 'List' : tab === 'bloques' ? 'LayoutGrid' : 'BrainCircuit'} size={14}/> {tab}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2 pb-10">
                                    {activeTab === 'temas' && (
                                        <>
                                            <div className="relative mb-4">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="Search" size={16} /></div>
                                                <input type="text" placeholder="Buscar por nombre de tema..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-sm text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
                                            </div>
                                            {OFFICIAL_TOPICS.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                                                <button key={t.id} onClick={() => startTest(t)} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-transparent active:border-emerald-200 transition-all text-left group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center font-black text-[10px] text-gray-400 group-active:bg-emerald-100 group-active:text-emerald-600 transition-colors">{t.id}</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800 uppercase italic tracking-tighter">{t.name}</p>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.cat}</p>
                                                        </div>
                                                    </div>
                                                    <Icon name="ChevronRight" size={16} className="text-gray-300" />
                                                </button>
                                            ))}
                                        </>
                                    )}

                                    {activeTab === 'bloques' && BLOCKS.map(b => (
                                        <button key={b.id} onClick={() => startTest(b)} className="w-full bg-white p-5 rounded-[2rem] flex items-center gap-5 shadow-sm btn-active text-left">
                                            <div className={`p-4 rounded-2xl ${b.color}`}><Icon name={b.icon}/></div>
                                            <div className="flex-1">
                                                <p className="font-black text-gray-800 text-xs uppercase italic">{b.name}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{b.cat}</p>
                                            </div>
                                            <Icon name="ChevronRight" size={16} className="text-gray-300" />
                                        </button>
                                    ))}

                                    {activeTab === 'aux' && AUX_TESTS.map(a => (
                                        <button key={a.id} onClick={() => startTest(a)} className="w-full bg-white p-5 rounded-[2rem] flex items-center gap-5 shadow-sm btn-active text-left">
                                            <div className={`p-4 rounded-2xl ${a.color}`}><Icon name={a.icon}/></div>
                                            <div className="flex-1">
                                                <p className="font-black text-gray-800 text-xs uppercase italic">{a.name}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{a.cat}</p>
                                            </div>
                                            <Icon name="ChevronRight" size={16} className="text-gray-300" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {view === 'quiz' && questions[currentIdx] && (
                            <div className="space-y-4 pt-4 animate-in">
                                <div className="flex justify-between items-center px-2">
                                    <div className="flex flex-col">
                                        <span className="bg-[#064d2e] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-tighter w-fit">
                                            {currentTitle}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#064d2e] uppercase tracking-widest">Pregunta {currentIdx + 1} de {questions.length}</span>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col min-h-[440px]">
                                    <div className="mb-8">
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
                                            <div 
                                                className="bg-emerald-500 h-full transition-all duration-500" 
                                                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                                            ></div>
                                        </div>
                                        <h2 className="text-lg font-black text-gray-800 leading-tight italic uppercase tracking-tighter">
                                            {questions[currentIdx].question}
                                        </h2>
                                    </div>

                                    <div className="space-y-3 flex-1">
                                        {questions[currentIdx].options.map((opt, i) => {
                                            let style = "bg-gray-50 border-gray-100 text-gray-600";
                                            if (isAnswered) {
                                                if (i === questions[currentIdx].correct) style = "bg-emerald-50 border-emerald-500 text-emerald-700";
                                                else if (selectedAns === i) style = "bg-red-50 border-red-500 text-red-700";
                                                else style = "opacity-40 grayscale";
                                            } else if (selectedAns === i) {
                                                style = "bg-emerald-50 border-emerald-500";
                                            }
                                            
                                            return (
                                                <button key={i} onClick={() => handleAnswer(i)} className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-bold flex gap-4 transition-all ${style}`}>
                                                    <span className="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[10px] bg-white border font-black uppercase">
                                                        {String.fromCharCode(65+i)}
                                                    </span>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {isAnswered && (
                                        <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100 text-blue-900 animate-in">
                                            <p className="font-black text-[9px] uppercase mb-2 flex items-center gap-2 text-blue-600 tracking-widest">
                                                <Icon name="AlertCircle" size={14}/> Explicación
                                            </p>
                                            <p className="text-xs leading-relaxed font-bold italic">{questions[currentIdx].justification}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pb-10">
                                    <button onClick={() => setView('home')} className="bg-white p-5 rounded-[2rem] border shadow-md text-gray-400 btn-active">
                                        <Icon name="Home" size={24} />
                                    </button>
                                    <button 
                                        onClick={finishTest} 
                                        className="bg-red-50 p-5 rounded-[2rem] border border-red-100 shadow-md text-red-400 btn-active"
                                        title="Finalizar Test"
                                    >
                                        <Icon name="Power" size={24} />
                                    </button>
                                    <button 
                                        onClick={nextQuestion} 
                                        disabled={!isAnswered} 
                                        className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase shadow-lg transition-all italic tracking-widest ${isAnswered ? 'bg-[#064d2e] text-white btn-active' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {currentIdx < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {view === 'results' && (
                            <div className="text-center py-10 space-y-8 animate-in">
                                <div className="text-yellow-500 flex justify-center"><Icon name="Trophy" size={80} /></div>
                                <h2 className="text-3xl font-black text-[#064d2e] italic uppercase tracking-tighter">Resultados</h2>
                                
                                <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-100 flex flex-col items-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Aciertos Reales</p>
                                    <p className="text-7xl font-black text-[#064d2e] italic">
                                        {stats.correct} <span className="text-3xl text-gray-300">/ {stats.done}</span>
                                    </p>
                                    <div className="mt-6 pt-6 border-t w-full grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-gray-400">Total Preguntas</p>
                                            <p className="text-xl font-black text-gray-700">{questions.length}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black uppercase text-gray-400">Puntuación %</p>
                                            <p className="text-xl font-black text-emerald-500">{successRate}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button onClick={() => setView('home')} className="w-full bg-[#064d2e] text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl btn-active transition-all italic tracking-widest">
                                        Menú Principal
                                    </button>
                                    {errorBank.length > 0 && (
                                        <button onClick={() => startTest({id: 'error-review'})} className="w-full bg-white text-red-500 border border-red-100 py-4 rounded-[2rem] font-black uppercase shadow-sm btn-active transition-all italic text-xs tracking-widest">
                                            Repasar Fallos ({errorBank.length})
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>