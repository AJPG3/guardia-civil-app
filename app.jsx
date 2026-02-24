<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>GC MASTER - Academia Inteligente</title>
    <!-- Tailwind & React -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Iconos Lucide (Simulados con SVG para máxima compatibilidad) -->
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;0,900;1,900&display=swap');
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        . animate-bounce { animation: bounce 1s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(-5%); } 50% { transform: translateY(0); } }
    </style>
</head>
<body class="bg-gray-50">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // --- CONFIGURACIÓN ---
        const apiKey = ""; // PEGA TU CLAVE AQUÍ SI TIENES UNA
        const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";

        const OFFICIAL_TOPICS = [
            { id: 1, name: "Derechos Humanos", cat: "Jurídicas" }, { id: 2, name: "Igualdad", cat: "Jurídicas" },
            { id: 3, name: "Prevención de Riesgos Laborales", cat: "Jurídicas" }, { id: 4, name: "Derecho Constitucional", cat: "Jurídicas" },
            { id: 5, name: "Derecho de la Unión Europea", cat: "Jurídicas" }, { id: 6, name: "Instituciones Internacionales", cat: "Jurídicas" },
            { id: 7, name: "Derecho Civil", cat: "Jurídicas" }, { id: 8, name: "Derecho Penal", cat: "Jurídicas" },
            { id: 9, name: "Derecho Procesal Penal", cat: "Jurídicas" }, { id: 10, name: "Derecho Administrativo", cat: "Jurídicas" },
            { id: 11, name: "Protección de Datos", cat: "Jurídicas" }, { id: 12, name: "Extranjería e Inmigración", cat: "Jurídicas" },
            { id: 13, name: "Seguridad Pública y Privada", cat: "Jurídicas" }, { id: 14, name: "Ministerio del Interior y Defensa", cat: "Jurídicas" },
            { id: 15, name: "Fuerzas y Cuerpos de Seguridad", cat: "Jurídicas" }, { id: 16, name: "Protección Civil", cat: "Socio-Cultural" },
            { id: 17, name: "Desarrollo Sostenible", cat: "Socio-Cultural" }, { id: 18, name: "Eficiencia Energética", cat: "Socio-Cultural" },
            { id: 19, name: "Tecnologías de la Información", cat: "Técnicas" }, { id: 20, name: "Estadística", cat: "Técnicas" },
            { id: 21, name: "Topografía", cat: "Técnicas" }, { id: 22, name: "Automovilismo", cat: "Técnicas" },
            { id: 23, name: "Armamento y Tiro", cat: "Técnicas" }, { id: 24, name: "Transmisiones", cat: "Técnicas" },
            { id: 25, name: "Lengua Extranjera (Inglés)", cat: "Inglés" }
        ];

        // Componente de Iconos (SVG inline para que no falle)
        const Icon = ({ name, size = 20, className = "" }) => {
            const icons = {
                shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
                trophy: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M12 22v-4m-7-9v4a7 7 0 0 0 14 0V9M8 22h8"/>,
                home: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>,
                zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
                search: <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            };
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    {icons[name] || <circle cx="12" cy="12" r="10"/>}
                </svg>
            );
        };

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

            const fetchQuestions = async (topicName) => {
                setLoading(true);
                setCurrentTitle(topicName);
                
                // Si no hay API Key, usamos preguntas de ejemplo para que no de error
                if (!apiKey) {
                    setTimeout(() => {
                        setQuestions([
                            { question: `Pregunta de muestra sobre ${topicName}`, options: ["Opción A", "Opción B", "Opción C", "Opción D"], correct: 0, justification: "Explicación de ejemplo." },
                            { question: `Otra pregunta sobre ${topicName}`, options: ["Opción A", "Opción B", "Opción C", "Opción D"], correct: 1, justification: "Segunda explicación." }
                        ]);
                        setView('quiz');
                        setLoading(false);
                    }, 1500);
                    return;
                }

                try {
                    const prompt = `Genera un JSON con 10 preguntas de examen de Guardia Civil sobre: ${topicName}. Estructura: {"questions": [{"question": "...", "options": ["...", "...", "...", "..."], "correct": 0, "justification": "..."}]}`;
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { responseMimeType: "application/json" }
                        })
                    });
                    const data = await response.json();
                    const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
                    setQuestions(parsed.questions);
                    setView('quiz');
                } catch (err) { alert("Error de conexión. Revisa tu API Key."); }
                finally { setLoading(false); }
            };

            const handleAnswer = (idx) => {
                if (isAnswered) return;
                setSelectedAns(idx);
                setIsAnswered(true);
                const isCorrect = idx === questions[currentIdx].correct;
                setStats(p => ({ done: p.done + 1, correct: isCorrect ? p.correct + 1 : p.correct }));
                if (!isCorrect) setErrorBank(p => [...p, questions[currentIdx]]);
            };

            const nextQuestion = () => {
                if (currentIdx < questions.length - 1) {
                    setCurrentIdx(c => c + 1);
                    setIsAnswered(false);
                    setSelectedAns(null);
                } else setView('results');
            };

            const successRate = stats.done > 0 ? Math.round((stats.correct / stats.done) * 100) : 0;

            if (loading) return (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
                    <div className="animate-bounce"><Icon name="zap" size={48} className="text-green-600 mb-4"/></div>
                    <h2 className="text-xl font-black text-gray-800 uppercase italic">Sincronizando IA...</h2>
                    <p className="text-gray-400 text-[10px] font-bold uppercase mt-2">{currentTitle}</p>
                </div>
            );

            return (
                <div className="min-h-screen pb-10">
                    <header className="bg-[#064d2e] text-white pt-12 pb-10 px-6 rounded-b-[2.5rem] shadow-xl sticky top-0 z-50">
                        <div className="flex justify-between items-center max-w-xl mx-auto">
                            <div className="flex items-center gap-2" onClick={() => setView('home')}>
                                <Icon name="shield" className="text-green-400" />
                                <h1 className="text-xl font-black italic tracking-tighter">GC MASTER</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-[8px] font-black opacity-40 uppercase">Probabilidad</p>
                                    <p className="text-xl font-black text-green-400">{successRate}%</p>
                                </div>
                                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                    <Icon name="trophy" size={18} className="text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="px-5 -mt-6 max-w-xl mx-auto">
                        {view === 'home' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => errorBank.length > 0 && setView('quiz')} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 text-left active:scale-95 transition-all">
                                        <p className="text-[9px] font-black text-red-500 uppercase mb-1">Errores</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-black text-gray-800">{errorBank.length}</span>
                                            <Icon name="zap" size={16} className="text-red-300" />
                                        </div>
                                    </button>
                                    <button onClick={() => fetchQuestions("Examen Oficial Guardia Civil")} className="bg-[#064d2e] p-5 rounded-[2rem] shadow-lg text-left active:scale-95 transition-all">
                                        <p className="text-[9px] font-black text-green-400 uppercase mb-1">Oficial</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-black text-white">★</span>
                                            <Icon name="trophy" size={16} className="text-yellow-400" />
                                        </div>
                                    </button>
                                </div>

                                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                                    {['temas', 'bloques', 'aux'].map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === tab ? 'bg-[#064d2e] text-white shadow-md' : 'text-gray-400'}`}>
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2 pb-10">
                                    {activeTab === 'temas' && (
                                        <>
                                            <div className="relative mb-4">
                                                <input type="text" placeholder="Buscar tema..." className="w-full pl-6 pr-4 py-4 rounded-2xl bg-white border-none shadow-sm text-sm font-medium" onChange={(e) => setSearchTerm(e.target.value)} />
                                            </div>
                                            {OFFICIAL_TOPICS.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map(t => (
                                                <button key={t.id} onClick={() => fetchQuestions(t.name)} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-transparent active:border-green-200 text-left">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center font-black text-[10px] text-gray-400">{t.id}</div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{t.name}</p>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase">{t.cat}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {view === 'quiz' && questions[currentIdx] && (
                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center px-2">
                                    <span className="bg-[#064d2e] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-tighter">{currentTitle}</span>
                                    <span className="text-[10px] font-black text-[#064d2e]">{currentIdx + 1} / {questions.length}</span>
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col min-h-[400px]">
                                    <h2 className="text-lg font-bold text-gray-800 mb-8 leading-tight">{questions[currentIdx].question}</h2>
                                    <div className="space-y-3">
                                        {questions[currentIdx].options.map((opt, i) => (
                                            <button key={i} onClick={() => handleAnswer(i)} className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-bold flex gap-4 transition-all ${isAnswered ? (i === questions[currentIdx].correct ? 'bg-green-50 border-green-500 text-green-700' : (selectedAns === i ? 'bg-red-50 border-red-500 text-red-700' : 'opacity-40')) : (selectedAns === i ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-100')}`}>
                                                <span className="w-6 h-6 shrink-0 rounded-lg flex items-center justify-center text-[10px] bg-white border font-black uppercase">{String.fromCharCode(65+i)}</span>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    {isAnswered && (
                                        <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100 text-blue-900 text-xs italic">
                                            <p className="font-black text-[9px] uppercase mb-1 text-blue-600">Explicación</p>
                                            {questions[currentIdx].justification}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pb-10">
                                    <button onClick={() => setView('home')} className="bg-white p-5 rounded-[2rem] border shadow-md text-gray-400"><Icon name="home" size={24}/></button>
                                    <button onClick={nextQuestion} disabled={!isAnswered} className={`flex-1 py-5 rounded-[2rem] font-black text-xs uppercase shadow-lg ${isAnswered ? 'bg-[#064d2e] text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {currentIdx < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {view === 'results' && (
                            <div className="text-center py-10 space-y-8">
                                <Icon name="trophy" size={80} className="mx-auto text-yellow-500" />
                                <h2 className="text-3xl font-black text-[#064d2e] italic">COMPLETADO</h2>
                                <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-100 inline-block px-16">
                                    <p className="text-7xl font-black text-[#064d2e]">{stats.correct} / {questions.length}</p>
                                </div>
                                <button onClick={() => setView('home')} className="w-full bg-[#064d2e] text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl">Volver al Inicio</button>
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
