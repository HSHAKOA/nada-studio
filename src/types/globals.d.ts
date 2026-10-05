// O App Router roda o React canary embutido no Next, que exporta <ViewTransition>.
/// <reference types="react/canary" />

interface Window {
  /** MotionRoot montou: cancela a rede de segurança do script inicial. */
  __nadaMotion?: boolean;
  /** A introdução está tocando; o hero espera o evento "nada:intro". */
  __nadaIntro?: boolean;
}
