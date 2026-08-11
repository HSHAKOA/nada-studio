"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  px: number;
  py: number;
  r: number;
  sx: number;
  sy: number;
};

type BigBangHeroProps = {
  logoSrc?: string;
  /** Altura do canvas. Por padrão preenche o container. */
  height?: number | string;
};

export default function BigBangHero({
  logoSrc = "/NADAlogopretatransparente.png",
  height = "100%",
}: BigBangHeroProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0,
      H = 0,
      cx = 0,
      cy = 0,
      raf = 0,
      t = 0,
      running = true;
    let P: Particle[] = [];
    const logo = new Image();
    let ready = false;

    const mobile = () => W < 640;

    function measure() {
      const r = canvas!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cx = W / 2;
      cy = H / 2;
      canvas!.width = Math.max(1, Math.round(W * dpr));
      canvas!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function reset() {
      const N = mobile() ? 800 : 1400;
      P = [];
      for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        const ring = Math.sqrt(1 - u * u);
        const sp = 1 + Math.pow(Math.random(), 0.42) * 6.2;
        P.push({
          x: 0,
          y: 0,
          z: 0,
          vx: Math.cos(a) * ring * sp,
          vy: u * sp,
          vz: Math.sin(a) * ring * sp,
          px: cx,
          py: cy,
          r: 0.5 + Math.random() * 1.5,
          sx: 0,
          sy: 0,
        });
      }
      t = 0;
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(0, 0, W, H);
    }

    const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);
    const easeInOut = (v: number) =>
      v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;

    const CORE = 66,
      OPEN = 175,
      CLOSE = 300,
      HOLD = 360;

    const logoWidth = () => Math.min(W * 0.52, 360);

    function paintLogoStatic() {
      ctx!.fillStyle = "#fff";
      ctx!.fillRect(0, 0, W, H);
      if (!ready) return;
      const lw = logoWidth();
      const lh = lw * (logo.height / logo.width);
      ctx!.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
    }

    function loop() {
      if (!running) return;
      t++;
      ctx!.fillStyle = t > CLOSE ? "rgba(255,255,255,0.26)" : "rgba(255,255,255,0.16)";
      ctx!.fillRect(0, 0, W, H);

      if (t < CORE) {
        const p = 2 + Math.sin(t / 5) * 3 + t / 22;
        ctx!.fillStyle = "#000";
        ctx!.beginPath();
        ctx!.arc(cx, cy, Math.max(p, 1), 0, 6.3);
        ctx!.fill();
        raf = requestAnimationFrame(loop);
        return;
      }

      const ang = t * 0.0038,
        ca = Math.cos(ang),
        sa = Math.sin(ang);

      // Congela a posição de tela no instante do fechamento: daí todo mundo
      // volta pro centro em linha reta.
      if (t === CLOSE) {
        const cc = Math.cos(CLOSE * 0.0038),
          sc = Math.sin(CLOSE * 0.0038);
        for (const q of P) {
          const a0 = q.x * cc - q.z * sc;
          const z0 = q.x * sc + q.z * cc;
          const pz0 = 520 / (520 + z0);
          q.sx = cx + a0 * pz0;
          q.sy = cy + q.y * pz0;
        }
      }

      const closing = t >= CLOSE;
      const ct = closing ? easeInOut(Math.min((t - CLOSE) / 70, 1)) : 0;

      for (const q of P) {
        let sxp: number, syp: number, al: number, rr: number;
        if (!closing) {
          const brake = t > OPEN ? 0.955 : 0.9955;
          q.x += q.vx;
          q.y += q.vy;
          q.z += q.vz;
          q.vx *= brake;
          q.vy *= brake;
          q.vz *= brake;
          const x1 = q.x * ca - q.z * sa,
            zz = q.x * sa + q.z * ca;
          const pz = 520 / (520 + zz);
          if (pz <= 0.05) {
            q.px = cx;
            q.py = cy;
            continue;
          }
          sxp = cx + x1 * pz;
          syp = cy + q.y * pz;
          al = Math.max(0.1, Math.min(0.85, pz * 0.95));
          rr = Math.max(q.r * pz, 0.4);
        } else {
          sxp = q.sx + (cx - q.sx) * ct;
          syp = q.sy + (cy - q.sy) * ct;
          al = Math.max(0, 0.8 * (1 - ct));
          rr = Math.max(q.r * (1 - ct * 0.6), 0.3);
        }
        const dx = sxp - q.px,
          dy = syp - q.py,
          ln = dx * dx + dy * dy;
        if (ln > 1 && ln < 14000 && al > 0.02) {
          ctx!.strokeStyle = `rgba(0,0,0,${al * 0.5})`;
          ctx!.lineWidth = rr * 0.9;
          ctx!.lineCap = "round";
          ctx!.beginPath();
          ctx!.moveTo(q.px, q.py);
          ctx!.lineTo(sxp, syp);
          ctx!.stroke();
        }
        if (al > 0.02) {
          ctx!.fillStyle = `rgba(0,0,0,${al})`;
          ctx!.beginPath();
          ctx!.arc(sxp, syp, rr, 0, 6.3);
          ctx!.fill();
        }
        q.px = sxp;
        q.py = syp;
      }

      if (ready && t > CLOSE + 18) {
        const lt = easeOut(Math.min((t - CLOSE - 18) / 50, 1));
        const lw = logoWidth() * (0.86 + 0.14 * lt);
        const lh = lw * (logo.height / logo.width);
        ctx!.globalAlpha = lt;
        ctx!.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
        ctx!.globalAlpha = 1;
      }

      if (t > HOLD + 150) reset();
      raf = requestAnimationFrame(loop);
    }

    function start() {
      measure();
      if (reduced) {
        paintLogoStatic();
        return;
      }
      reset();
      raf = requestAnimationFrame(loop);
    }

    logo.crossOrigin = "anonymous";
    logo.onload = () => {
      ready = true;
      // Se a animação já está rodando, a logo entra sozinha no próximo ciclo.
      if (reduced) paintLogoStatic();
    };
    // Sem a logo a explosão continua — só não revela nada no fim.
    logo.onerror = () => {
      ready = false;
    };
    logo.src = logoSrc;

    start();

    function onVis() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running && !reduced) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }

    let rt: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(() => {
        measure();
        if (reduced) paintLogoStatic();
        else reset();
      }, 180);
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(rt);
      logo.onload = null;
      logo.onerror = null;
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [logoSrc]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Partículas explodindo e se reagrupando na logo NADA Studio"
      style={{ width: "100%", height, display: "block", background: "#fff" }}
    />
  );
}
