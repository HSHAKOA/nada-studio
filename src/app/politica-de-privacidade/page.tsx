import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade da NADA Studio: quais dados coletamos, por que coletamos e quais são os seus direitos conforme a LGPD.",
  alternates: {
    canonical: "/politica-de-privacidade",
  },
};

export default function PoliticaDePrivacidade() {
  return (
    <>
      <Navbar />
      <main className="section pt-32">
        <div className="wrap prose-measure">
          <h1 className="text-[clamp(32px,4.2vw,52px)]">
            Política de Privacidade
          </h1>
          <p className="mt-4 text-sm text-black/50">
            Última atualização: 11 de agosto de 2026
          </p>

          <p className="mt-8 text-black/70">
            A NADA Studio respeita a sua privacidade e leva a sério a
            proteção dos seus dados pessoais. Esta Política explica, de
            forma clara, quais dados coletamos, por que coletamos, como
            usamos e quais são os seus direitos, em conformidade com a Lei
            Geral de Proteção de Dados (Lei nº 13.709/2018, a
            &ldquo;LGPD&rdquo;).
          </p>
          <p className="mt-4 text-black/70">
            Esta Política se aplica ao tratamento de dados coletados
            diretamente por este site institucional (contatos, orçamentos e
            navegação). Quando a NADA Studio desenvolve ou opera sites,
            sistemas e automações para clientes, atua como prestadora de
            serviço (operadora) sobre os dados desses clientes, sendo o
            tratamento regido pelos respectivos contratos e pelas políticas
            de privacidade de cada cliente.
          </p>

          <h2 className="mt-10 text-2xl">1. Quem é o responsável pelos seus dados</h2>
          <p className="mt-4 text-black/70">
            Os responsáveis pelo tratamento dos dados coletados neste site
            (os &ldquo;controladores&rdquo;, na linguagem da LGPD) são Eric
            Crispim de Oliveira e João Passos, operando sob a marca NADA
            Studio. Para qualquer assunto relacionado aos seus dados, o
            contato é nada.estudio.br@gmail.com.
          </p>

          <h2 className="mt-10 text-2xl">2. Quais dados coletamos</h2>
          <p className="mt-4 text-black/70">
            Coletamos apenas os dados necessários para atender você. Na
            prática, são:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>
              Dados que você nos fornece: ao preencher um formulário de
              contato ou nos chamar no WhatsApp, você pode informar nome,
              telefone, e-mail e a mensagem com a descrição do que precisa.
            </li>
            <li>
              Dados de navegação: ao acessar o site, podem ser coletados
              automaticamente dados técnicos como endereço IP, tipo de
              dispositivo, navegador e páginas visitadas, por meio de
              cookies (ver seção 6).
            </li>
          </ul>
          <p className="mt-4 text-black/70">
            Não coletamos dados sensíveis (como origem racial, opinião
            política, saúde ou biometria) e não solicitamos esse tipo de
            informação por este site.
          </p>

          <h2 className="mt-10 text-2xl">3. Por que usamos os seus dados</h2>
          <p className="mt-4 text-black/70">
            Utilizamos os seus dados para as seguintes finalidades:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>responder ao seu contato e tirar dúvidas;</li>
            <li>elaborar e enviar propostas e orçamentos;</li>
            <li>
              prestar os serviços contratados e manter a comunicação durante
              o trabalho;
            </li>
            <li>melhorar o site e entender como ele é utilizado.</li>
          </ul>

          <h2 className="mt-10 text-2xl">4. Com que base legal tratamos os dados</h2>
          <p className="mt-4 text-black/70">
            Cada uso tem um fundamento previsto na LGPD:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>
              Execução de contrato e procedimentos preliminares: quando você
              pede um orçamento ou contrata nossos serviços.
            </li>
            <li>
              Consentimento: quando você nos envia seus dados
              voluntariamente por formulário ou WhatsApp para ser
              contatado.
            </li>
            <li>
              Legítimo interesse: para melhorar o site e nossa comunicação,
              sempre respeitando os seus direitos.
            </li>
          </ul>

          <h2 className="mt-10 text-2xl">5. Com quem compartilhamos os seus dados</h2>
          <p className="mt-4 text-black/70">
            Nós não vendemos os seus dados. Podemos compartilhá-los apenas
            com prestadores de serviço que dão suporte à operação do site e
            do atendimento, e somente na medida necessária, como:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>serviços de hospedagem e infraestrutura do site (por exemplo, Vercel);</li>
            <li>serviços de banco de dados e armazenamento (por exemplo, Supabase);</li>
            <li>ferramentas de comunicação e automação utilizadas no atendimento (por exemplo, WhatsApp);</li>
            <li>autoridades públicas, quando houver obrigação legal.</li>
          </ul>
          <p className="mt-4 text-black/70">
            Esses parceiros têm suas próprias políticas de segurança e são
            obrigados a tratar os dados de forma compatível com esta
            Política.
          </p>

          <h2 className="mt-10 text-2xl">6. Cookies</h2>
          <p className="mt-4 text-black/70">
            O site utiliza apenas cookies estritamente necessários ao seu
            funcionamento e à segurança da navegação. Esses cookies não
            dependem de consentimento prévio, mas você é informado sobre o
            uso deles aqui.
          </p>
          <p className="mt-4 text-black/70">
            Atualmente não utilizamos cookies de análise de audiência,
            publicidade ou rastreamento de terceiros. Caso isso mude no
            futuro, esta Política será atualizada e o site passará a exibir
            um aviso de cookies com opção de aceitar ou recusar os cookies
            não essenciais antes de sua ativação.
          </p>
          <p className="mt-4 text-black/70">
            Você pode gerenciar ou bloquear cookies nas configurações do seu
            navegador. Ao bloquear cookies, algumas funcionalidades podem
            não operar corretamente.
          </p>

          <h2 className="mt-10 text-2xl">7. Transferência internacional de dados</h2>
          <p className="mt-4 text-black/70">
            Algumas das ferramentas que utilizamos (por exemplo, Vercel e
            Supabase) podem armazenar dados em servidores localizados fora
            do Brasil. Nesses casos, nos termos do art. 33 da LGPD,
            trabalhamos com prestadores que oferecem garantias adequadas de
            proteção, incluindo cláusulas contratuais e padrões de segurança
            reconhecidos internacionalmente.
          </p>

          <h2 className="mt-10 text-2xl">8. Por quanto tempo guardamos os dados</h2>
          <p className="mt-4 text-black/70">
            Guardamos os seus dados apenas pelo tempo necessário para
            cumprir as finalidades desta Política. Dados de contato e
            navegação de quem não fecha contrato são mantidos pelo tempo
            necessário ao atendimento e depois eliminados. Dados vinculados
            a contratos e obrigações fiscais são guardados pelo prazo legal
            aplicável (em regra, 5 anos). Encerrados os prazos, os dados são
            eliminados ou anonimizados.
          </p>

          <h2 className="mt-10 text-2xl">9. Segurança</h2>
          <p className="mt-4 text-black/70">
            Adotamos medidas técnicas e organizacionais razoáveis para
            proteger os seus dados contra acessos não autorizados, perda ou
            alteração indevida, incluindo conexão criptografada (HTTPS) e
            uso de fornecedores com boas práticas de segurança. Nenhum
            sistema é 100% infalível, mas nos comprometemos a agir com
            diligência. Em caso de incidente de segurança que possa
            acarretar risco relevante, comunicaremos os titulares afetados e
            a ANPD nos termos da LGPD.
          </p>

          <h2 className="mt-10 text-2xl">10. Os seus direitos</h2>
          <p className="mt-4 text-black/70">
            A LGPD garante a você, a qualquer momento, o direito de:
          </p>
          <ul className="mt-4 space-y-2 text-black/70">
            <li>confirmar se tratamos os seus dados e acessá-los;</li>
            <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
            <li>
              solicitar a anonimização, o bloqueio ou a eliminação de dados
              desnecessários;
            </li>
            <li>solicitar a portabilidade dos dados;</li>
            <li>
              revogar o consentimento e pedir a exclusão dos dados tratados
              com base nele;
            </li>
            <li>obter informações sobre com quem compartilhamos seus dados.</li>
          </ul>
          <p className="mt-4 text-black/70">
            Para exercer qualquer um desses direitos, basta entrar em
            contato pelo e-mail nada.estudio.br@gmail.com. Responderemos em
            até 15 (quinze) dias, prazo previsto na LGPD.
          </p>
          <p className="mt-4 text-black/70">
            Você também tem o direito de apresentar reclamação diretamente à
            Autoridade Nacional de Proteção de Dados (ANPD), caso entenda
            que seus dados não foram tratados adequadamente.
          </p>

          <h2 className="mt-10 text-2xl">11. Alterações desta Política</h2>
          <p className="mt-4 text-black/70">
            Podemos atualizar esta Política de Privacidade periodicamente. A
            versão vigente é sempre a publicada nesta página, com a data de
            última atualização no topo. Recomendamos revisá-la de tempos em
            tempos.
          </p>

          <h2 className="mt-10 text-2xl">12. Contato</h2>
          <p className="mt-4 text-black/70">
            Dúvidas sobre esta Política ou sobre o tratamento dos seus
            dados:
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
