const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white font-sans">
      <div className="bg-emerald-500 p-6 rounded-full mb-6 shadow-lg shadow-emerald-500/20">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.357 11.357 0 00-1.03 3.11c-.456 2.1-.456 4.287 0 6.387a11.357 11.357 0 001.03 3.11c1.243 2.772 3.153 5.05 5.518 6.516A11.955 11.955 0 0012 21.756a11.955 11.955 0 008.618-3.04a11.357 11.357 0 001.03-3.11c.456-2.1.456-4.287 0-6.387a11.357 11.357 0 00-1.03-3.11z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-2">¡CONSEGUIDO!</h1>
      <p class="text-slate-400 text-lg mb-8">La estructura de tu App está funcionando al 100%.</p>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md">
        <p className="text-emerald-400 font-medium mb-2 text-sm uppercase tracking-wider">Próximo paso:</p>
        <p className="text-slate-200">Copia ahora aquí dentro el código completo de los tests y la academia que guardaste anteriormente.</p>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
