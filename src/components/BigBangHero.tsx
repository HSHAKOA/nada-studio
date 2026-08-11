"use client";

import { useEffect, useRef } from "react";

type Particle = {
  vx: number;
  vy: number;
  vz: number;
  r: number;
};

// Fases, em "frames". Viraram posições numa régua de scroll, não tempo.
const CORE = 66; // ponto pulsando antes de estourar
const OPEN = 175; // freia mais forte a partir daqui
const CLOSE = 300; // começa a recolher pro centro
const RECOLHE = 70; // duração do recolhimento
const TOTAL = CLOSE + RECOLHE + 60; // 430: sobra pro logo terminar de aparecer

const FREIO_LENTO = 0.9955;
const FREIO_FORTE = 0.955;
const ABERTURA = OPEN - CORE;

// Deslocamento acumulado de `x += v; v *= freio` depois de n passos, para v0 = 1.
// Soma de PG, então dá pra saltar direto pra qualquer frame — é isso que deixa a
// animação andar pra trás quando o scroll volta. Como é linear na velocidade
// inicial, o fator é o mesmo pra todas as partículas do frame: calcula uma vez
// e multiplica, em vez de 1400 Math.pow iguais.
function fatorDeslocamento(n: number) {
  if (n <= 0) return 0;
  if (n <= ABERTURA) {
    return (1 - Math.pow(FREIO_LENTO, n)) / (1 - FREIO_LENTO);
  }
  const ate = (1 - Math.pow(FREIO_LENTO, ABERTURA)) / (1 - FREIO_LENTO);
  const vNaAbertura = Math.pow(FREIO_LENTO, ABERTURA);
  const m = n - ABERTURA;
  return ate + (vNaAbertura * (1 - Math.pow(FREIO_FORTE, m))) / (1 - FREIO_FORTE);
}

// Tudo que só depende do frame, calculado uma vez por frame.
function quadro(f: number, escala: number) {
  const ang = f * 0.0038;
  return {
    fator: fatorDeslocamento(f - CORE) * escala,
    ca: Math.cos(ang),
    sa: Math.sin(ang),
  };
}

type Quadro = ReturnType<typeof quadro>;

export default function BigBangHero({
  logoSrc = "/NADAlogopretatransparente.png",
}: {
  logoSrc?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trilhaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const trilha = trilhaRef.current;
    if (!canvas || !trilha) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, cx = 0, cy = 0, escala = 1;
    let P: Particle[] = [];
    let raf = 0;
    let frameDesenhado = -1;
    let visivel = true;

    const logo = new Image();
    let logoPronta = false;

    function medir() {
      const r = canvas!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cx = W / 2;
      cy = H / 2;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Tela cheia é bem maior que a caixa de 560px do layout antigo, então a
      // explosão cresce junto pra continuar preenchendo.
      escala = Math.max(W, H) / 620;
      frameDesenhado = -1;
    }

    function semear() {
      const n = window.innerWidth < 640 ? 700 : 1400;
      P = [];
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        const anel = Math.sqrt(1 - u * u);
        const sp = 1 + Math.pow(Math.random(), 0.42) * 6.2;
        P.push({
          vx: Math.cos(a) * anel * sp,
          vy: u * sp,
          vz: Math.sin(a) * anel * sp,
          r: 0.5 + Math.random() * 1.5,
        });
      }
    }

    const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
    const easeInOut = (v: number) =>
      v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;

    const larguraLogo = () => Math.min(W * 0.42, 420);

    function desenharLogo(alpha: number, crescimento = 1) {
      if (!logoPronta) return;
      const lw = larguraLogo() * crescimento;
      const lh = lw * (logo.height / logo.width);
      ctx!.globalAlpha = alpha;
      ctx!.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
      ctx!.globalAlpha = 1;
    }

    // Posição de uma partícula na tela, dado o quadro. Determinística: mesmo
    // frame, mesmo resultado, venha o scroll de onde vier.
    function posicao(q: Particle, k: Quadro) {
      const x = q.vx * k.fator;
      const y = q.vy * k.fator;
      const z = q.vz * k.fator;
      const x1 = x * k.ca - z * k.sa;
      const zz = x * k.sa + z * k.ca;
      const perto = 520 / (520 + zz);
      if (perto <= 0.05) return null;
      return { x: cx + x1 * perto, y: cy + y * perto, perto };
    }

    function desenhar(f: number) {
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(0, 0, W, H);

      // Antes de estourar: só o ponto, pulsando conforme o scroll.
      if (f < CORE) {
        const p = (2 + Math.sin(f / 5) * 3 + f / 22) * Math.max(escala, 1);
        ctx!.fillStyle = "#000";
        ctx!.beginPath();
        ctx!.arc(cx, cy, Math.max(p, 1), 0, 6.3);
        ctx!.fill();
        return;
      }

      const recolhendo = f >= CLOSE;
      const t = recolhendo ? easeInOut(Math.min((f - CLOSE) / RECOLHE, 1)) : 0;
      // O rastro é a distância até alguns frames atrás — some junto ao recolher.
      const atras = recolhendo ? 0 : 3;

      const kAgora = quadro(recolhendo ? CLOSE : f, escala);
      const kAntes = atras ? quadro(f - atras, escala) : null;

      ctx!.lineCap = "round";
      for (const q of P) {
        const agora = posicao(q, kAgora);
        if (!agora) continue;

        let x = agora.x, y = agora.y, alpha, raio;
        if (recolhendo) {
          x = agora.x + (cx - agora.x) * t;
          y = agora.y + (cy - agora.y) * t;
          alpha = Math.max(0, 0.8 * (1 - t));
          raio = Math.max(q.r * (1 - t * 0.6), 0.3);
        } else {
          alpha = Math.max(0.1, Math.min(0.85, agora.perto * 0.95));
          raio = Math.max(q.r * agora.perto, 0.4);
        }
        if (alpha <= 0.02) continue;

        if (kAntes) {
          const antes = posicao(q, kAntes);
          if (antes) {
            ctx!.strokeStyle = `rgba(0,0,0,${alpha * 0.5})`;
            ctx!.lineWidth = raio * 0.9;
            ctx!.beginPath();
            ctx!.moveTo(antes.x, antes.y);
            ctx!.lineTo(x, y);
            ctx!.stroke();
          }
        }
        ctx!.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx!.beginPath();
        ctx!.arc(x, y, raio, 0, 6.3);
        ctx!.fill();
      }

      const inicioLogo = CLOSE + 18;
      if (f > inicioLogo) {
        const lt = easeOut(Math.min((f - inicioLogo) / 50, 1));
        desenharLogo(lt, 0.86 + 0.14 * lt);
      }
    }

    function progresso() {
      const r = trilha!.getBoundingClientRect();
      // Quanto da trilha já passou pelo topo da janela.
      const percorrido = -r.top;
      const total = r.height - window.innerHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, percorrido / total));
    }

    function aoQuadro() {
      raf = 0;
      if (!visivel) return;
      const f = Math.round(progresso() * TOTAL);
      if (f !== frameDesenhado) {
        frameDesenhado = f;
        desenhar(f);
      }
    }

    function agendar() {
      if (raf || !visivel) return;
      raf = requestAnimationFrame(aoQuadro);
    }

    function estatico() {
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(0, 0, W, H);
      desenharLogo(1);
    }

    logo.crossOrigin = "anonymous";
    logo.onload = () => {
      logoPronta = true;
      frameDesenhado = -1;
      if (reduzido) estatico();
      else agendar();
    };
    logo.onerror = () => {
      logoPronta = false;
    };
    logo.src = logoSrc;

    medir();
    semear();
    if (reduzido) estatico();
    else agendar();

    // Só desenha com o hero na tela. Sem isso o scroll do site inteiro ficaria
    // pagando por um canvas que ninguém está vendo.
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (visivel) agendar();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    let larguraAnterior = window.innerWidth;
    let tid: ReturnType<typeof setTimeout>;
    function aoRedimensionar() {
      // Esconder a barra de endereço no mobile dispara resize só na altura.
      // Remedir sempre, mas re-semear as partículas só se a largura mudou.
      const mudouLargura = window.innerWidth !== larguraAnterior;
      larguraAnterior = window.innerWidth;
      clearTimeout(tid);
      tid = setTimeout(() => {
        medir();
        if (mudouLargura) semear();
        if (reduzido) estatico();
        else agendar();
      }, 150);
    }

    const aoRolar = () => agendar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRedimensionar);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(tid);
      logo.onload = null;
      logo.onerror = null;
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, [logoSrc]);

  return (
    <div ref={trilhaRef} className="relative h-[295svh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Partículas explodindo e se reagrupando na logo NADA Studio"
          className="block h-full w-full bg-white"
        />
      </div>
    </div>
  );
}
