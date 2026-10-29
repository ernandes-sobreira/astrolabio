# Astrolábio — ProfÁgua / UNEMAT

Plataforma de orientação do percurso acadêmico, de Ernandes Sobreira Oliveira Junior e Carla Galbiati.

Acesse https://ernandes-sobreira.github.io/astrolabio/

## Contas e salas

Entre com Google ou email e senha. Crie uma sala para o projeto ou abra uma sala já vinculada à sua conta. As respostas locais anteriores só são copiadas para uma nova sala quando a opção correspondente é marcada.

O dono gera convites por código de 128 bits, válidos por sete dias, com permissão de leitura ou de edição. O convidado entra na própria conta e cola o código. O dono pode revogar convites e remover participantes. Revogar um convite impede novas entradas; para retirar quem já entrou, remova também o participante. Remover um participante não invalida um convite que ele já recebeu: revogue o convite também.

As alterações são salvas no Firebase e transmitidas aos participantes da sala. Transações com revisão detectam edições simultâneas. Se duas versões colidirem, o aplicativo preserva a cópia local e pede que o participante baixe suas alterações antes de carregar a versão da nuvem, evitando sobrescrita silenciosa. Conflitos não são mesclados automaticamente.

JSON e Word continuam disponíveis. Faça exportações periódicas do projeto. O salvamento depende de conexão; o indicador informa quando a gravação na nuvem não foi concluída.

## Infraestrutura

- Firebase: `astrolabio-profagua`, plano Spark.
- Authentication: Google e email/senha.
- Firestore Standard: `southamerica-east1`.
- Regras de acesso versionadas em `firebase/firestore.rules`.
- O frontend contém apenas a configuração pública do aplicativo. Não há chaves administrativas.
- A tabela de salas não é pública: somente membros autenticados podem ler. Convites não podem ser listados.

## Logos

Os PNGs fornecidos pelo responsável foram incorporados com suas proporções originais. CAPES e ANA são imagens separadas. O Word não recomprime os PNGs nem aplica a antiga correção de fundo preto aos novos brasões.
