type AdminLoginViewProps = {
  logoSrc: string;
  backgroundSrc: string;
  googleIconSrc: string;
  onGoogleLogin?: () => void;
  busy?: boolean;
  error?: string;
  configurationError?: string;
};

export function AdminLoginView({
  logoSrc,
  backgroundSrc,
  googleIconSrc,
  onGoogleLogin,
  busy = false,
  error,
  configurationError,
}: AdminLoginViewProps) {
  const unavailable = Boolean(configurationError || !onGoogleLogin);

  return (
    <main className="at-login">
      <div
        className="at-login__photo"
        style={{ backgroundImage: `url("${backgroundSrc}")` }}
        aria-hidden="true"
      />
      <div className="at-login__wash" aria-hidden="true" />

      <section className="at-login__panel" aria-label="Acesso à plataforma">
        <div className="at-login__brand">
          <div className="at-login__owner">
            <strong>AE</strong> Consultoria
          </div>

          <div className="at-login__identity">
            <img className="at-login__logo" src={logoSrc} alt="Armazém Tag Classificados" />
            <p className="at-login__tagline">Um lugar, várias opções.</p>
          </div>
        </div>

        <div className="at-login__access">
          <div className="at-login__form">
            <h1>Bem-vindo(a)</h1>
            <p className="at-login__description">Entre na sua conta para continuar.</p>

            <div className="at-login__fields">
              <label className="at-login__field">
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                />
              </label>

              <label className="at-login__field">
                <span>Senha</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                />
              </label>
            </div>

            <button
              className="at-login__google"
              type="button"
              onClick={onGoogleLogin}
              disabled={busy || unavailable}
              aria-busy={busy}
            >
              <img src={googleIconSrc} alt="" aria-hidden="true" />
              <span>{busy ? "Conectando…" : "Entrar com Google"}</span>
            </button>

            {(configurationError || error) && (
              <div className="at-login__error" role="alert">
                {configurationError || error}
              </div>
            )}

            <div className="at-login__security">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <path d="M12 14v3" />
              </svg>
              <span>Acesso com sua conta Google.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
