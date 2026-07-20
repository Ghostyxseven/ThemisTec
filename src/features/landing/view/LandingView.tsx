import Link from "next/link";
import { ArrowRight, Briefcase, CalendarClock, CircleDollarSign, Scale } from "lucide-react";

export function LandingView(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary to-primary-dark p-2 rounded-xl text-white shadow-lg shadow-primary/20">
              <Scale className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              ThemisTec
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              Já tenho conta
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg active:scale-95"
            >
              Acessar Sistema
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Background decorations */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
          <div className="absolute top-12 -right-24 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
          
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
              A gestão do seu escritório, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                mais inteligente.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto">
              O ThemisTec é a plataforma definitiva para advogados autônomos. 
              Organize seus processos, acompanhe honorários e gerencie prazos em um único lugar, com segurança e rapidez.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
              >
                Começar Agora <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Gestão de Processos</h3>
              <p className="text-slate-600 leading-relaxed">
                Acompanhe o andamento de todos os seus processos e clientes de forma centralizada. Pesquisa rápida e exportação inteligente.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-emerald-500/20 transition-all duration-300 group">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <CircleDollarSign className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Controle Financeiro</h3>
              <p className="text-slate-600 leading-relaxed">
                Saiba exatamente quanto você tem a receber. Controle os honorários pendentes e pagos de cada processo com facilidade.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-amber-500/20 transition-all duration-300 group sm:col-span-2 lg:col-span-1">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <CalendarClock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Agenda Jurídica</h3>
              <p className="text-slate-600 leading-relaxed">
                Nunca mais perca um prazo. Sistema inteligente de alertas e notificações para suas audiências e datas importantes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span className="font-semibold text-slate-700">ThemisTec</span>
          </div>
          <p>© {new Date().getFullYear()} ThemisTec. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
