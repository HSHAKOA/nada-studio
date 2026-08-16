import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do site da NADA Studio: como funciona a navegação, os serviços oferecidos e as responsabilidades de cada parte.",
  alternates: {
    canonical: "/termos-de-uso",
  },
};

export default function TermosDeUso() {
  return (
    <>
      <Navbar />
      <main className="section pt-32">
        <div className="wrap prose-measure">
          <h1 className="text-[clamp(32px,4.2vw,52px)]">Termos de Uso</h1>
          <p className="mt-4 text-sm text-black/50">
            Última atualização: 11 de agosto de 2026
          </p>

          <p className="mt-8 text-black/70">
            Bem-vindo ao site da NADA Studio. Estes Termos de Uso regulam o
            acesso e a utilização do site nadastudio.com.br e de suas
            páginas. Ao navegar por este site, você declara que leu, entendeu
            e concorda com as condições abaixo. Se você não concordar com
            qualquer ponto, pedimos que não utilize o site.
          </p>

          <h2 className="mt-10 text-2xl">1. Quem somos</h2>
          <p className="mt-4 text-black/70">
            O site é operado por Eric Crispim de Oliveira e João Passos,
            responsáveis pela marca NADA Studio, com contato pelo e-mail
            nada.estudio.br@gmail.com e pelo WhatsApp +55 11 93215-9328. Ao
            longo destes Termos, referimo-nos a essa operação como &ldquo;NADA
            Studio&rdquo;, &ldquo;nós&rdquo; ou &ldquo;nosso&rdquo;.
          </p>

          <h2 className="mt-10 text-2xl">2. Objeto do site</h2>
          <p className="mt-4 text-black/70">
            Este é um site institucional. Ele existe para apresentar a NADA
            Studio, descrever nossos serviços e permitir que interessados
            entrem em contato. O site tem caráter informativo e não
            constitui, por si só, uma proposta comercial ou contrato de
            prestação de serviço.
          </p>

          <h2 className="mt-10 text-2xl">3. Nossos serviços</h2>
          <p className="mt-4 text-black/70">
            A NADA Studio desenvolve sites, automação de processos e
            aplicações sob medida, com foco em eliminar tarefas manuais e
            repetitivas do dia a dia dos clientes. As descrições de serviço
            apresentadas no site são gerais. Cada trabalho é definido
            individualmente por meio de proposta e contrato próprios, que
            estabelecem escopo, valores, prazos e condições específicas. Nada
            no site substitui esse contrato individual.
          </p>

          <h2 className="mt-10 text-2xl">4. Uso correto do site</h2>
          <p className="mt-4 text-black/70">
            Ao usar o site, você concorda em não:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>
              utilizar o site para qualquer finalidade ilegal ou não
              autorizada;
            </li>
            <li>
              tentar acessar áreas restritas, sistemas ou dados sem
              autorização;
            </li>
            <li>
              introduzir vírus, códigos maliciosos ou qualquer elemento que
              prejudique o funcionamento do site;
            </li>
            <li>
              copiar, reproduzir ou explorar comercialmente o conteúdo do
              site sem autorização prévia e por escrito.
            </li>
          </ul>

          <h2 className="mt-10 text-2xl">5. Propriedade intelectual</h2>
          <p className="mt-4 text-black/70">
            Todo o conteúdo deste site, incluindo textos, imagens, layout,
            código, a marca NADA Studio, o wordmark &ldquo;NADA&rdquo;
            desenhado à mão e toda a identidade visual, é de titularidade da
            NADA Studio e está protegido pela legislação brasileira. Você
            pode navegar e visualizar o conteúdo livremente, mas não pode
            reproduzi-lo, distribuí-lo ou utilizá-lo para outros fins sem
            autorização por escrito.
          </p>

          <h2 className="mt-10 text-2xl">6. Links e serviços de terceiros</h2>
          <p className="mt-4 text-black/70">
            O site pode conter links para páginas externas, como Instagram e
            WhatsApp. Esses ambientes têm regras próprias e não estão sob
            nosso controle. Não nos responsabilizamos pelo conteúdo, pelas
            práticas de privacidade ou pelo funcionamento de sites e serviços
            de terceiros.
          </p>

          <h2 className="mt-10 text-2xl">
            7. Disponibilidade e responsabilidade
          </h2>
          <p className="mt-4 text-black/70">
            Trabalhamos para manter o site disponível e funcionando
            corretamente, mas ele é oferecido &ldquo;no estado em que se
            encontra&rdquo;. Não garantimos que estará disponível de forma
            ininterrupta ou livre de falhas.
          </p>
          <p className="mt-4 text-black/70">
            Na medida permitida pela lei, a NADA Studio não se responsabiliza
            por danos decorrentes do uso ou da impossibilidade de uso do
            site, incluindo:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>
              indisponibilidades técnicas, manutenções ou falhas de conexão;
            </li>
            <li>
              falhas ou instabilidade de serviços de terceiros usados na
              operação do site (por exemplo, hospedagem, banco de dados,
              WhatsApp);
            </li>
            <li>
              eventos de força maior, caso fortuito ou ataques cibernéticos
              de terceiros não decorrentes de falha de segurança de nossa
              responsabilidade.
            </li>
          </ul>
          <p className="mt-4 text-black/70">
            Esta limitação não afasta a responsabilidade da NADA Studio nos
            casos de dolo ou culpa grave, nem prejudica direitos assegurados
            ao consumidor pela legislação aplicável.
          </p>

          <h2 className="mt-10 text-2xl">8. Privacidade e proteção de dados</h2>
          <p className="mt-4 text-black/70">
            O tratamento dos dados pessoais coletados por este site é
            descrito na nossa{" "}
            <a
              href="/politica-de-privacidade"
              className="underline decoration-black/30 underline-offset-4 hover:decoration-black"
            >
              Política de Privacidade
            </a>
            , que faz parte integrante destes Termos. Ao utilizar o site,
            você reconhece ter tomado ciência dela.
          </p>

          <h2 className="mt-10 text-2xl">9. Alterações destes Termos</h2>
          <p className="mt-4 text-black/70">
            Podemos atualizar estes Termos de Uso a qualquer momento, para
            refletir mudanças no site, nos serviços ou na legislação. A
            versão vigente é sempre a publicada nesta página, com a data de
            última atualização indicada no topo. O uso continuado do site
            após eventuais mudanças significa concordância com a versão
            atualizada.
          </p>

          <h2 className="mt-10 text-2xl">10. Legislação e foro</h2>
          <p className="mt-4 text-black/70">
            Estes Termos são regidos pelas leis da República Federativa do
            Brasil, em especial o Código Civil, o Código de Defesa do
            Consumidor, o Marco Civil da Internet (Lei nº 12.965/2014) e a
            LGPD (Lei nº 13.709/2018). Fica eleito o foro da comarca de
            Jundiaí/SP para resolver qualquer questão decorrente destes
            Termos, ressalvado o direito do consumidor de optar pelo foro de
            seu domicílio.
          </p>

          <h2 className="mt-10 text-2xl">11. Contato</h2>
          <p className="mt-4 text-black/70">
            Em caso de dúvidas sobre estes Termos de Uso, fale com a gente:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>E-mail: nada.estudio.br@gmail.com</li>
            <li>WhatsApp: +55 11 93215-9328</li>
            <li>Instagram: @nada.studio.br</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
