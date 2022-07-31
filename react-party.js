import H, { useRef as S, useCallback as q, useEffect as x } from "react";
const U = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b"
], B = Math.PI * 2, G = (e, i) => {
  if (i < 0 || i > 1)
    throw new Error("x value must be 0-1");
  const o = Object.values(e).reduce((t, l) => t + l, 0);
  let r = i;
  for (let [t, l] of Object.entries(e)) {
    if (r < l / o)
      return t;
    r -= l / o;
  }
}, J = (e) => {
  const i = S(), o = q(() => {
    e(), i.current = requestAnimationFrame(o);
  }, [e]);
  x(() => (i.current = requestAnimationFrame(o), () => cancelAnimationFrame(i.current)), [o]);
}, K = ({ ctx: e, x: i, y: o, p: r, scale: t }) => {
  const l = i + r.tilt;
  e.beginPath(), e.lineCap = "butt", e.lineWidth = r.diameter * t, e.strokeStyle = r.color, e.moveTo((l + r.diameter / 2) * t, o * t), e.lineTo(l * t, (o + r.tilt + r.diameter / 2) * t), e.stroke();
}, Q = ({ ctx: e, x: i, y: o, p: r, scale: t }) => {
  e.fillStyle = r.color, e.beginPath(), e.ellipse(
    i * t,
    o * t,
    r.diameter / 1.5 * t * (1 + r.tilt / 100),
    r.diameter / 1.5 * t,
    0,
    0,
    B
  ), e.fill();
}, y = ({ numPoints: e = 3, spiked: i = !1, spikedPortion: o = 0.5, fill: r = !0 } = {}) => ({ ctx: t, x: l, y: k, p: a, scale: u }) => {
  const C = B / e, [R, P] = [l * u, k * u];
  t.beginPath(), t.fillStyle = a.color, t.strokeStyle = a.color;
  for (let f = 0; f < e + 1; f++) {
    const T = a.tilt / 50 + f % e * C, A = R + Math.cos(T) * u * a.diameter * (1 + a.tilt / 100), O = P + Math.sin(T) * u * a.diameter * (1 + Math.sin(a.tilt / 50));
    if (i) {
      const I = a.tilt / 50 + (f % e - 0.5) * C, N = R + o * Math.cos(I) * u * a.diameter * (1 + a.tilt / 100), d = P + o * Math.sin(I) * u * a.diameter * (1 + Math.sin(a.tilt / 50));
      t.lineTo(N, d);
    }
    f === 0 ? t.moveTo(A, O) : t.lineTo(A, O);
  }
  r ? t.fill() : t.stroke();
}, X = {
  line: K,
  circle: Q,
  triangle: y({ numPoints: 3 }),
  pentagon: y({ numPoints: 5 }),
  hexagon: y({ numPoints: 6 }),
  heptagon: y({ numPoints: 7 }),
  octagon: y({ numPoints: 8 }),
  star: y({ numPoints: 5, spiked: !0 })
}, $ = ({
  gravity: e = 1.3,
  simulationSpeed: i = 1.5,
  tiltAmount: o = 15,
  xVelocityBase: r = 0,
  xVelocityVariance: t = 1.5,
  yVelocityBase: l = -1,
  yVelocityVariance: k = 3,
  diameterBase: a = 5,
  diameterVariance: u = 10,
  tiltBase: C = -10,
  tiltVariance: R = 10,
  tiltAngleBase: P = 0,
  tiltAngleVariance: f = B,
  tiltAngleIncrementBase: T = 0.05,
  tiltAngleIncrementVariance: A = 0.07,
  colors: O = U,
  shapeDrawingFunctions: I = X,
  shapeWeights: N = {
    triangle: 2,
    circle: 1,
    star: 1,
    line: 1
  }
} = {}) => {
  const d = S([]), D = q(
    ({ count: h = 75, sourceRef: v } = {}) => {
      var s, w, g, L;
      const { left: b, top: z, width: c, height: m } = (L = (g = (s = v == null ? void 0 : v.current) == null ? void 0 : s.getBoundingClientRect()) != null ? g : (w = document.activeElement) == null ? void 0 : w.getBoundingClientRect()) != null ? L : document.body.getBoundingClientRect();
      d.current = [
        ...d.current,
        ...Array.from({ length: h }, () => {
          const [W, E] = [b + Math.random() * c, z + Math.random() * m], [_, n] = [b + c / 2, z + m / 2], M = Math.atan2(E - n, W - _), F = Math.cos(M) * Math.random() * t + r, j = Math.sin(M) * Math.random() * k + l;
          return {
            x: W,
            y: E,
            vx: F,
            vy: j,
            diameter: Math.random() * u + a,
            tilt: Math.random() * R + C,
            tiltAngleIncrement: Math.random() * A + T,
            tiltAngle: Math.random() * f + P,
            color: O[Math.random() * O.length | 0],
            shape: G(N, Math.random())
          };
        })
      ];
    },
    [
      r,
      t,
      l,
      k,
      a,
      u,
      C,
      R,
      P,
      f,
      T,
      A,
      N
    ]
  );
  return { Confetti: () => {
    const h = S(), v = S(), b = S(), z = q(() => {
      const c = h.current, m = c.getBoundingClientRect(), { width: s, height: w } = m, g = window.devicePixelRatio;
      v.current = m, c.scale = g, c.width = Math.floor(s * g), c.height = Math.floor(w * g);
    }, []);
    return x(() => {
      if (h.current) {
        const c = new ResizeObserver(z);
        return c.observe(h.current), () => c.disconnect();
      }
    }, []), x(() => {
      if (h.current) {
        const c = h.current.getContext("2d");
        b.current = c;
      }
    }, []), J(() => {
      if (h.current && b.current && v.current) {
        const c = h.current, m = b.current, s = c.scale, { width: w, height: g, left: L, top: W } = v.current, [E, _] = [w * s, g * s];
        d.current = d.current.map((n) => {
          const M = i / 10, F = e / 100;
          return {
            ...n,
            tiltAngle: n.tiltAngle + n.tiltAngleIncrement,
            vy: n.vy + F * s,
            x: n.x + n.vx * n.diameter * s * M,
            y: n.y + n.vy * n.diameter * s * M,
            tilt: Math.sin(n.tiltAngle) * o
          };
        }), d.current = d.current.filter((n) => !(n.x < 0 || n.x > E || n.y > _)), m.clearRect(0, 0, E * s, _ * s);
        for (let n of d.current) {
          const [M, F] = [n.x - L, n.y - W], j = I[n.shape];
          j({ p: n, x: M, y: F, ctx: m, scale: s });
        }
      }
    }), /* @__PURE__ */ H.createElement("canvas", {
      ref: h,
      style: {
        display: "block",
        position: "absolute",
        pointerEvents: "none",
        inset: 0,
        width: "100%",
        height: "100%"
      }
    });
  }, showConfetti: D };
};
export {
  X as SHAPE_DRAWING_FUNCTIONS,
  Q as drawCircleParticle,
  K as drawLineParticle,
  y as makeDrawRegularPolygonParticle,
  $ as useConfetti
};
