<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Silver | Orcamento domestico sem friccao</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=space-grotesk:400,500,700|manrope:400,500,600,700,800" rel="stylesheet" />

    <style>
        :root {
            --bg: #f4efe7;
            --bg-deep: #12353f;
            --surface: rgba(255, 250, 244, 0.78);
            --surface-strong: #fffaf3;
            --line: rgba(16, 46, 56, 0.12);
            --ink: #0f2530;
            --muted: #53707b;
            --brand: #1b7f73;
            --brand-deep: #115249;
            --accent: #f0b548;
            --accent-soft: #fde7b5;
            --shadow: 0 28px 60px rgba(21, 40, 46, 0.14);
        }

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            min-height: 100vh;
            color: var(--ink);
            font-family: "Manrope", ui-sans-serif, system-ui, sans-serif;
            background:
                radial-gradient(circle at top left, rgba(27, 127, 115, 0.16), transparent 34%),
                radial-gradient(circle at 90% 12%, rgba(240, 181, 72, 0.28), transparent 30%),
                linear-gradient(180deg, #f6f0e8 0%, #f1ece4 48%, #f8f5ef 100%);
        }

        a {
            color: inherit;
        }

        .shell {
            max-width: 1180px;
            margin: 0 auto;
            padding: 28px 24px 64px;
        }

        .topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 28px;
        }

        .brand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            font-weight: 700;
            letter-spacing: 0.03em;
        }

        .brand-mark {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            object-fit: cover;
            box-shadow: 0 0 0 5px rgba(27, 127, 115, 0.12);
        }

        .brand-copy small {
            display: block;
            color: var(--muted);
            font-family: "Manrope", ui-sans-serif, system-ui, sans-serif;
            font-size: 0.76rem;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .brand-copy strong {
            display: block;
            font-size: 1.05rem;
        }

        .auth-links {
            display: inline-flex;
            align-items: center;
            gap: 12px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 46px;
            padding: 11px 18px;
            border-radius: 14px;
            border: 1px solid transparent;
            text-decoration: none;
            font-weight: 700;
            transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .btn-outline {
            background: rgba(255, 250, 244, 0.64);
            border-color: rgba(15, 37, 48, 0.14);
        }

        .btn-primary {
            color: #fffef9;
            background: linear-gradient(135deg, var(--brand), var(--brand-deep));
            box-shadow: 0 14px 28px rgba(17, 82, 73, 0.24);
        }

        .hero {
            position: relative;
            overflow: hidden;
            display: grid;
            gap: 28px;
            grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
            padding: 34px;
            border: 1px solid var(--line);
            border-radius: 32px;
            background:
                linear-gradient(145deg, rgba(255, 251, 246, 0.88), rgba(249, 241, 228, 0.82)),
                rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(12px);
            box-shadow: var(--shadow);
            animation: rise 0.7s ease both;
        }

        .hero::after {
            content: "";
            position: absolute;
            inset: auto -60px -120px auto;
            width: 280px;
            height: 280px;
            border-radius: 999px;
            background: radial-gradient(circle, rgba(27, 127, 115, 0.16), transparent 70%);
            pointer-events: none;
        }

        .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(27, 127, 115, 0.1);
            color: var(--brand-deep);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.09em;
            text-transform: uppercase;
        }

        .eyebrow::before {
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: var(--accent);
            box-shadow: 0 0 0 6px rgba(240, 181, 72, 0.18);
        }

        h1 {
            margin: 0;
            max-width: 11ch;
            font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            font-size: clamp(2.7rem, 7vw, 5rem);
            line-height: 0.96;
            letter-spacing: -0.04em;
        }

        .hero p {
            margin: 18px 0 0;
            max-width: 60ch;
            color: var(--muted);
            font-size: 1.05rem;
            line-height: 1.72;
        }

        .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 24px;
        }

        .signal-row {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 28px;
        }

        .signal {
            padding: 16px;
            border: 1px solid rgba(15, 37, 48, 0.08);
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.62);
        }

        .signal strong {
            display: block;
            margin-bottom: 6px;
            font-size: 1.02rem;
        }

        .signal span {
            color: var(--muted);
            font-size: 0.92rem;
            line-height: 1.5;
        }

        .story-panel {
            position: relative;
            z-index: 1;
            display: grid;
            gap: 16px;
            align-content: start;
        }

        .story-card,
        .story-strip,
        .audience-card,
        .feature-card,
        .journey-card {
            border: 1px solid var(--line);
            border-radius: 24px;
            background: rgba(255, 252, 247, 0.9);
            box-shadow: 0 18px 34px rgba(21, 40, 46, 0.08);
        }

        .story-card {
            padding: 24px;
            background:
                linear-gradient(180deg, rgba(17, 82, 73, 0.96), rgba(18, 53, 63, 0.98));
            color: #f7f3eb;
        }

        .story-card h2 {
            margin: 0 0 12px;
            font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            font-size: 1.35rem;
        }

        .story-card p,
        .story-card li {
            color: rgba(247, 243, 235, 0.82);
        }

        .story-card ul {
            margin: 18px 0 0;
            padding: 0;
            list-style: none;
        }

        .story-card li + li {
            margin-top: 12px;
        }

        .story-card li strong {
            display: block;
            color: #fff;
            font-size: 0.95rem;
            margin-bottom: 4px;
        }

        .story-strip {
            display: grid;
            gap: 12px;
            padding: 18px;
        }

        .story-strip div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 14px 16px;
            border-radius: 18px;
            background: rgba(27, 127, 115, 0.08);
        }

        .story-strip strong {
            display: block;
            font-size: 0.95rem;
        }

        .story-strip span {
            color: var(--muted);
            font-size: 0.88rem;
        }

        .story-strip b {
            flex-shrink: 0;
            font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            color: var(--brand-deep);
            font-size: 1.1rem;
        }

        .section {
            margin-top: 24px;
            display: grid;
            gap: 18px;
        }

        .section-heading {
            display: flex;
            flex-wrap: wrap;
            align-items: end;
            justify-content: space-between;
            gap: 14px;
            margin-top: 44px;
        }

        .section-heading h2 {
            margin: 0;
            font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            font-size: clamp(1.7rem, 4vw, 2.4rem);
            line-height: 1;
        }

        .section-heading p {
            margin: 0;
            max-width: 56ch;
            color: var(--muted);
            line-height: 1.65;
        }

        .audience-grid,
        .feature-grid,
        .journey-grid {
            display: grid;
            gap: 16px;
        }

        .audience-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .audience-card,
        .feature-card,
        .journey-card {
            padding: 22px;
        }

        .audience-card {
            background: rgba(255, 252, 247, 0.88);
        }

        .audience-card b,
        .feature-card b,
        .journey-card b {
            display: inline-flex;
            align-items: center;
            min-height: 32px;
            padding: 0 11px;
            border-radius: 999px;
            background: var(--accent-soft);
            color: #7b5410;
            font-size: 0.74rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }

        .audience-card h3,
        .feature-card h3,
        .journey-card h3 {
            margin: 16px 0 10px;
            font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
            font-size: 1.14rem;
        }

        .audience-card p,
        .feature-card p,
        .journey-card p {
            margin: 0;
            color: var(--muted);
            line-height: 1.62;
        }

        .feature-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .feature-card {
            position: relative;
            overflow: hidden;
            min-height: 240px;
        }

        .feature-card::after {
            content: "";
            position: absolute;
            right: -22px;
            bottom: -22px;
            width: 110px;
            height: 110px;
            border-radius: 28px;
            background: linear-gradient(135deg, rgba(27, 127, 115, 0.14), rgba(240, 181, 72, 0.24));
            transform: rotate(16deg);
        }

        .journey-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .journey-card strong {
            display: block;
            margin-top: 18px;
            margin-bottom: 10px;
            color: var(--brand-deep);
            font-size: 2rem;
            line-height: 1;
            font-family: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
        }

        .footer-band {
            margin-top: 44px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 22px 24px;
            border-radius: 24px;
            background: var(--bg-deep);
            color: #f7f3eb;
        }

        .footer-band p {
            margin: 0;
            max-width: 48ch;
            color: rgba(247, 243, 235, 0.78);
            line-height: 1.6;
        }

        .footer-band .btn-outline {
            color: #f7f3eb;
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.12);
        }

        @keyframes rise {
            from {
                opacity: 0;
                transform: translateY(18px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 1080px) {
            .hero {
                grid-template-columns: 1fr;
            }

            .audience-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 840px) {
            .shell {
                padding: 18px 16px 40px;
            }

            .topbar,
            .section-heading,
            .footer-band {
                align-items: flex-start;
                flex-direction: column;
            }

            .hero {
                padding: 24px;
                border-radius: 26px;
            }

            .signal-row,
            .feature-grid,
            .journey-grid,
            .audience-grid {
                grid-template-columns: 1fr;
            }

            h1 {
                max-width: 12ch;
            }

            .auth-links {
                width: 100%;
                flex-wrap: wrap;
            }

            .auth-links .btn {
                flex: 1 1 180px;
            }
        }
    </style>
</head>
<body>
    <div class="shell">
        <header class="topbar">
            <div class="brand">
                <img class="brand-mark" src="{{ asset('images/silver-logo.jpeg') }}" alt="Logo Silver">
                <div class="brand-copy">
                    <small>Plataforma de organizacao financeira</small>
                    <strong>Silver</strong>
                </div>
            </div>

            @if (Route::has('login'))
                <nav class="auth-links">
                    @auth
                        <a class="btn btn-outline" href="{{ url('/dashboard') }}">Abrir dashboard</a>
                    @else
                        <a class="btn btn-outline" href="{{ route('login') }}">Entrar</a>
                        @if (Route::has('register'))
                            <a class="btn btn-primary" href="{{ route('register') }}">Criar conta</a>
                        @endif
                    @endauth
                </nav>
            @endif
        </header>

        <main>
            <section class="hero">
                <div>
                    <span class="eyebrow">Orcamento domestico sem atrito</span>
                    <h1>O Silver transforma rotina em controle financeiro.</h1>
                    <p>
                        O projeto Silver foi desenhado para reduzir a friccao no registro de gastos, centralizar receitas e despesas
                        da familia e manter tudo sincronizado entre dashboard web, mobile e interacoes por WhatsApp.
                    </p>

                    <div class="hero-actions">
                        @if (Route::has('register'))
                            <a class="btn btn-primary" href="{{ route('register') }}">Comecar agora</a>
                        @endif
                        @if (Route::has('login'))
                            <a class="btn btn-outline" href="{{ route('login') }}">Ver area de acesso</a>
                        @endif
                    </div>

                    <div class="signal-row">
                        <div class="signal">
                            <strong>Registro rapido</strong>
                            <span>Captura despesas e receitas no momento em que elas acontecem, sem depender de planilhas.</span>
                        </div>
                        <div class="signal">
                            <strong>Visao consolidada</strong>
                            <span>Reune saldo, historico, metas e orcamentos em um unico ambiente acessivel.</span>
                        </div>
                        <div class="signal">
                            <strong>Uso em qualquer contexto</strong>
                            <span>Funciona para quem registra no celular, analisa no computador e conversa no WhatsApp.</span>
                        </div>
                    </div>
                </div>

                <aside class="story-panel" aria-label="Resumo do produto">
                    <div class="story-card">
                        <h2>Por que o Silver existe</h2>
                        <p>
                            Muitas pessoas sabem que precisam acompanhar o dinheiro, mas abandonam a rotina porque registrar uma transacao
                            simples ainda costuma ser demorado. O Silver combate exatamente esse ponto.
                        </p>
                        <ul>
                            <li>
                                <strong>Menos etapas para registrar</strong>
                                Fluxos pensados para capturar movimentacoes sem cansar o usuario.
                            </li>
                            <li>
                                <strong>Mais consistencia ao longo do mes</strong>
                                Acesso rapido no canal certo para evitar esquecimento e abandono.
                            </li>
                            <li>
                                <strong>Leitura clara para decidir melhor</strong>
                                Dashboard para analisar habitos, metas e planejamento com mais profundidade.
                            </li>
                        </ul>
                    </div>

                    <div class="story-strip">
                        <div>
                            <span>
                                <strong>WhatsApp</strong>
                                Entrada rapida para gastos do dia a dia.
                            </span>
                            <b>01</b>
                        </div>
                        <div>
                            <span>
                                <strong>Dashboard web</strong>
                                Painel para saldo, extrato, metas e orcamentos.
                            </span>
                            <b>02</b>
                        </div>
                        <div>
                            <span>
                                <strong>Sincronizacao entre dispositivos</strong>
                                Informacao consistente entre momentos de registro e analise.
                            </span>
                            <b>03</b>
                        </div>
                    </div>
                </aside>
            </section>

            <div class="section-heading">
                <div>
                    <h2>Feito para perfis reais</h2>
                </div>
                <p>
                    A proposta do Silver atende familias, autonomos, usuarios mobile-first e pessoas que precisam de leitura analitica
                    mais forte para planejar melhor o mes.
                </p>
            </div>

            <section class="audience-grid">
                <article class="audience-card">
                    <b>Familias</b>
                    <h3>Controle compartilhado da casa</h3>
                    <p>Centraliza despesas de alimentacao, moradia, transporte, educacao e lazer para dar transparencia ao planejamento familiar.</p>
                </article>

                <article class="audience-card">
                    <b>Autonomos</b>
                    <h3>Separacao entre pessoal e trabalho</h3>
                    <p>Ajuda a acompanhar entradas e saidas com mais disciplina para evitar mistura de caixa e perda de visibilidade.</p>
                </article>

                <article class="audience-card">
                    <b>Mobile-first</b>
                    <h3>Interacao no ritmo do cotidiano</h3>
                    <p>Entrega velocidade para quem usa o celular como principal ponto de acesso e quer registrar tudo sem interromper a rotina.</p>
                </article>

                <article class="audience-card">
                    <b>Analiticos</b>
                    <h3>Leitura mais profunda das financas</h3>
                    <p>Oferece base para relatorios, metas e acompanhamento estruturado dos habitos de consumo ao longo do tempo.</p>
                </article>
            </section>

            <div class="section-heading">
                <div>
                    <h2>O que a plataforma entrega</h2>
                </div>
                <p>
                    A landing agora comunica os pilares centrais do produto definidos na documentacao: registrar rapido, consolidar dados
                    e apoiar decisoes com uma experiencia distribuida.
                </p>
            </div>

            <section class="feature-grid">
                <article class="feature-card">
                    <b>RF01 + RF09</b>
                    <h3>Registro e alertas pelo WhatsApp</h3>
                    <p>O canal conversacional aproxima o controle financeiro do comportamento real do usuario, reduzindo esquecimento e barreiras no registro.</p>
                </article>

                <article class="feature-card">
                    <b>RF02 + RF12</b>
                    <h3>Dashboard para saldo, extrato e historico</h3>
                    <p>Uma tela maior para consultar movimentacoes, acompanhar o mes e filtrar o historico sem perder contexto.</p>
                </article>

                <article class="feature-card">
                    <b>RF06 + RF11</b>
                    <h3>Metas e orcamentos para planejar</h3>
                    <p>O Silver nao serve apenas para registrar: ele organiza limites, objetivos e progresso para apoiar decisoes futuras.</p>
                </article>
            </section>

            <div class="section-heading">
                <div>
                    <h2>Fluxo simples, visao completa</h2>
                </div>
                <p>
                    A experiencia esperada pelo projeto parte de tres momentos: registrar sem friccao, sincronizar automaticamente e analisar
                    o panorama financeiro com clareza.
                </p>
            </div>

            <section class="journey-grid">
                <article class="journey-card">
                    <b>Passo 1</b>
                    <strong>Registrar</strong>
                    <h3>Captura imediata da movimentacao</h3>
                    <p>Assim que uma despesa ou receita acontece, o usuario consegue registrar no canal mais pratico para aquele momento.</p>
                </article>

                <article class="journey-card">
                    <b>Passo 2</b>
                    <strong>Sincronizar</strong>
                    <h3>Dados consistentes entre interfaces</h3>
                    <p>As informacoes precisam aparecer atualizadas entre web, mobile e integracoes para evitar retrabalho e divergencia.</p>
                </article>

                <article class="journey-card">
                    <b>Passo 3</b>
                    <strong>Analisar</strong>
                    <h3>Leitura clara para agir</h3>
                    <p>O dashboard consolida saldo, historico, metas e orcamentos para transformar registros em planejamento real.</p>
                </article>
            </section>

            <section class="footer-band">
                <div>
                    <h2 style="margin: 0 0 8px; font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;">Silver conecta rotina, clareza e decisao.</h2>
                    <p>
                        A pagina inicial agora apresenta o produto como plataforma de controle financeiro domestico distribuida, e nao mais
                        como placeholder de sprint.
                    </p>
                </div>

                @if (Route::has('login'))
                    <a class="btn btn-outline" href="{{ route('login') }}">Acessar plataforma</a>
                @endif
            </section>
        </main>
    </div>
</body>
</html>
