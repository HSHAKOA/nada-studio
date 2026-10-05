// Capa em motion pra projeto que não tem tela pra filmar. É ilustração no
// desenho da marca (preto, branco, traço), não imitação de interface: mostra
// o gesto do projeto. Só transform e opacity (globals.css, bloco "Capa em
// cena"). Com movimento reduzido, fica o quadro final.

// Larguras das barras do código, em unidades (o desenho é sempre o mesmo).
const BARRAS = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 1, 3, 2, 4, 1, 2, 1];
// Alturas da onda de áudio, de 0 a 1.
const ONDA = [0.3, 0.55, 0.8, 0.45, 0.95, 0.6, 0.35, 0.7, 1, 0.5, 0.75, 0.4, 0.85, 0.55, 0.3, 0.65, 0.9, 0.45, 0.6, 0.35];
// Larguras das linhas de texto que a onda vira, em % da coluna.
const LINHAS = [92, 78, 86, 54];

// Leitor de estoque: a linha de leitura passa pelo código, bipa e o movimento
// (entrada ou saída) aparece.
function Leitor() {
  return (
    <div className="cena cena-leitor">
      <div className="cena-codigo">
        {BARRAS.map((largura, i) => (
          <span key={i} style={{ flexGrow: largura }} />
        ))}
        <span className="cena-leitura">
          <i />
        </span>
      </div>
      <p className="cena-movimentos">
        <span className="cena-mov cena-entrada">
          +1 <small>entrada</small>
        </span>
        <span className="cena-mov cena-saida">
          −1 <small>saída</small>
        </span>
      </p>
    </div>
  );
}

// Transcrição: a onda do áudio em cima, as linhas de texto se escrevendo embaixo.
function Transcricao() {
  return (
    <div className="cena cena-transcricao">
      <div className="cena-onda">
        {ONDA.map((altura, i) => (
          <span key={i} style={{ "--a": altura, "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className="cena-texto">
        {LINHAS.map((largura, i) => (
          <span key={i} style={{ width: `${largura}%`, "--i": i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}

export default function CapaCena({ cena }: { cena: "leitor" | "transcricao" }) {
  return cena === "leitor" ? <Leitor /> : <Transcricao />;
}
