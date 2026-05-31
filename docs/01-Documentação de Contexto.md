# Introdução 

O cenário financeiro doméstico contemporâneo exige agilidade e precisão na gestão de recursos. Com a proliferação de meios de pagamento e a descentralização das contas, manter um controle financeiro rigoroso tornou-se um desafio para muitas famílias brasileiras.

Diante dessa realidade, surge o projeto Silver, uma plataforma digital projetada para auxiliar no gerenciamento do orçamento doméstico de forma integrada e intuitiva. A proposta da plataforma é oferecer uma solução tecnológica capaz de centralizar informações financeiras em um único ambiente, permitindo ao usuário registrar, visualizar e analisar suas movimentações financeiras de maneira prática e organizada.

Nesse contexto, o Silver é concebido como uma plataforma distribuída de alta performance, projetada para unificar o controle do orçamento doméstico por meio de uma arquitetura moderna e acessível. Para atender às demandas atuais de acessibilidade e mobilidade, o sistema foi idealizado com uma arquitetura distribuída que possibilita a integração entre diferentes interfaces, como aplicações Web, Mobile e ferramentas de mensageria instantânea.

Dessa forma, os usuários podem acessar suas informações financeiras em diferentes dispositivos e contextos de uso, ampliando a flexibilidade, a usabilidade e a praticidade na gestão do orçamento doméstico.

## Problema

Muitas pessoas enfrentam dificuldades para manter um controle financeiro consistente no dia a dia. Apesar de reconhecerem a importância de acompanhar receitas e despesas, a rotina acelerada e a falta de ferramentas práticas acabam dificultando a manutenção desse hábito. Como consequência, gastos deixam de ser registrados, o que compromete a visão real da situação financeira e dificulta o planejamento de curto e longo prazo.

Um dos principais problemas está na **fricção existente no processo de registro das informações financeiras**. Diversos aplicativos disponíveis exigem múltiplas etapas para registrar uma simples transação, como selecionar categorias, preencher vários campos ou navegar por diferentes telas. Esse processo torna o registro lento e pouco prático, especialmente em situações cotidianas, como durante compras ou pagamentos rápidos.

Além disso, outro desafio relevante é a **falta de consistência no uso das ferramentas ao longo do tempo**. Muitos usuários iniciam o uso de aplicativos de controle financeiro, porém acabam abandonando essas soluções após algumas semanas devido à complexidade das interfaces ou à dificuldade de registrar informações de forma rápida.

Outro fator importante é a **diversidade de dispositivos utilizados no cotidiano**. Usuários frequentemente utilizam o celular para registrar despesas no momento da compra e o computador para visualizar relatórios ou planejar o orçamento mensal. Quando as ferramentas não oferecem uma sincronização eficiente entre diferentes plataformas, podem ocorrer atrasos na atualização dos dados ou dificuldades de acesso às informações mais recentes.

Diante desse cenário, torna-se necessário desenvolver soluções que **reduzam a complexidade do registro financeiro e se adaptem ao comportamento digital dos usuários**, permitindo que o controle de gastos seja integrado de forma natural ao cotidiano. Ferramentas que ofereçam múltiplas formas de interação e acesso facilitado tendem a aumentar a adesão dos usuários e a continuidade do uso.

Nesse contexto, o **Silver** busca enfrentar esse problema ao oferecer uma plataforma que simplifica o registro de transações financeiras e disponibiliza diferentes pontos de acesso ao sistema. A proposta inclui a integração com aplicações Web, Mobile e ferramentas de mensageria instantânea, permitindo que os usuários registrem e consultem suas informações financeiras de maneira prática.

## Objetivos

### Objetivo Geral
Desenvolver uma plataforma distribuída composta por uma API robusta em Laravel, um Dashboard Web para análises complexas e integração com chatbot WhatsApp para automação do controle financeiro pessoal.

### Objetivos Específicos
- Implementar um backend escalável em Laravel para processamento de transações e gestão de metas.
- Desenvolver um Dashboard Web completo para visualização de relatórios e planejamento orçamentário.
- Integrar um serviço de mensageria via WhatsApp para inserção rápida de receitas e despesas.
- Garantir a integridade e sincronização dos dados entre as diferentes interfaces da plataforma.
- Prover um sistema de metas e orçamentos que ajude o usuário no planejamento financeiro de curto e longo prazo.

## Justificativa

Diferente de soluções legadas que focam em uma única plataforma, o **Silver** justifica-se pela sua natureza distribuída. A escolha do **Laravel** no backend permite uma gestão de dados segura e eficiente, enquanto a interface Web entrega o poder analítico necessário para o planejamento doméstico. A grande inovação reside na integração com o **WhatsApp**, transformando uma ferramenta de comunicação cotidiana em um terminal financeiro potente, eliminando o esquecimento e a preguiça no registro de gastos. O projeto foca na experiência do usuário e na produtividade, democratizando o acesso a ferramentas de gestão financeira profissional.

## Público-Alvo

O projeto é direcionado a:

**Famílias modernas (25 a 55 anos)**  
Núcleos familiares compostos por casais ou responsáveis que necessitam compartilhar e centralizar o controle de gastos domésticos, como despesas com alimentação, moradia, educação, transporte e lazer. Esse público geralmente pertence às classes socioeconômicas **B e C**, nas quais há uma necessidade maior de planejamento financeiro para equilibrar renda e despesas mensais. Nesse contexto, a plataforma permite que diferentes membros da família tenham acesso às informações financeiras, promovendo maior transparência e facilitando o planejamento coletivo do orçamento familiar.

**Profissionais autônomos e trabalhadores independentes (20 a 50 anos)**  
Indivíduos que realizam atividades profissionais de forma autônoma, como freelancers, prestadores de serviço e pequenos empreendedores. Esses usuários frequentemente precisam separar receitas e despesas pessoais das relacionadas ao trabalho, o que nem sempre ocorre de maneira organizada. A plataforma auxilia na organização dessas movimentações financeiras, permitindo maior controle sobre entradas, saídas e fluxo de caixa.

**Usuários mobile-first (18 a 40 anos)**  
Pessoas que utilizam dispositivos móveis como principal meio de acesso a serviços digitais e que priorizam soluções rápidas e práticas. Esse público tende a utilizar aplicativos de mensageria instantânea, como o WhatsApp, como principal ferramenta de comunicação e interação digital, buscando registrar e consultar informações financeiras de forma simples, rápida e integrada ao seu cotidiano.

**Entusiastas de planejamento financeiro (25 a 45 anos)**  
Usuários que possuem maior interesse em acompanhar dados financeiros de forma estruturada, utilizando dashboards, relatórios e visualizações gráficas para analisar hábitos de consumo, acompanhar metas e realizar projeções financeiras de curto, médio e longo prazo. Esse perfil costuma possuir maior familiaridade com ferramentas digitais e busca soluções que permitam uma análise mais aprofundada das próprias finanças.
