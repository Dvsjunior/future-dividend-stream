import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo.png";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && (!name || !confirm))) {
      setError("Preencha todos os campos");
      return;
    }
    if (mode === "signup" && password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }
    if (mode === "signup") {
      try {
        const users = JSON.parse(localStorage.getItem("ia-users") || "[]");
        users.push({ name, email });
        localStorage.setItem("ia-users", JSON.stringify(users));
      } catch {}
    }
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-background/70" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass rounded-2xl p-8 glow-primary">
          <div className="flex flex-col items-center mb-8">
            <motion.img
              src={logo}
              alt="Investidor Automático"
              className="w-20 h-20 mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h1 className="font-display text-2xl font-bold text-gradient">
              INVESTIDOR AUTOMÁTICO
            </h1>
            <p className="text-muted-foreground font-body text-lg mt-2">
              Seu patrimônio no piloto automático
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-lg transition-all"
                />
              </div>
            )}

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-lg transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full pl-12 pr-12 py-3.5 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-lg transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {mode === "signup" && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body text-lg transition-all"
                />
              </div>
            )}

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm font-body">
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 gradient-primary rounded-xl font-display font-bold text-primary-foreground text-sm tracking-wider glow-primary transition-all"
            >
              {mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
            </motion.button>

            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="w-full text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "login" ? "Não tem conta? Criar nova conta" : "Já tem conta? Entrar"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
