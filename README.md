# Astrolábio — ProfÁgua / UNEMAT

Plataforma de orientação do percurso acadêmico, de Ernandes Sobreira Oliveira Junior e Carla Galbiati.

Acesse https://ernandes-sobreira.github.io/astrolabio/

## Contas e salas

Entre com Google ou email e senha. Na primeira entrada, o Astrolábio cria automaticamente um percurso privado na conta e importa respostas locais escritas antes do login, se houver. Para acessar em outro celular ou computador, entre com a mesma conta. Cada percurso fica salvo na nuvem e sincroniza as alterações. Ao sair da conta, as respostas da nuvem são removidas do aparelho; nada de uma conta fica visível para a próxima.

O dono gera convites por código de 128 bits, válidos por sete dias, com permissão de leitura ou de edição. O convidado abre o link ou cola o código na própria conta; se for a primeira entrada dele no Astrolábio, o percurso pessoal é criado e em seguida a sala compartilhada é aberta. Os convites ficam na coleção `invites` e só o dono da sala consegue listá-los. Remover um participante também apaga os convites que ele usou.

As alterações são salvas no Firebase e transmitidas aos participantes da sala. Quando duas pessoas editam ao mesmo tempo, as versões são combinadas campo a campo: cada resposta alterada por apenas uma das pessoas é preservada; se as duas alteraram a mesma resposta, prevalece a de quem está digitando, e o indicador de status informa quantos campos foram resolvidos assim. O cursor e a posição de rolagem são mantidos durante a atualização.

"Limpar" apaga a sala inteira quando há um projeto da nuvem aberto, e o aviso diz isso; apenas o dono pode fazê-lo. Se o serviço de contas não carregar, o aplicativo oferece o modo local, em que as respostas ficam só no aparelho.

JSON e Word continuam disponíveis. Faça exportações periódicas do projeto. O botão "Editor do Word" abre os campos complementares do documento (resumo livre, palavras-chave, cidade e ano da capa, capítulos e cronograma). A figura cartográfica do Word depende da API do IBGE; se ela não responder, o documento é gerado sem a figura e com uma nota no lugar.

## Infraestrutura

- Firebase: `astrolabio-profagua`, plano Spark.
- Authentication: Google e email/senha.
- Firestore Standard: `southamerica-east1`.
- Regras de acesso versionadas em `firebase/firestore.rules`. Após qualquer alteração em `salas.js` que toque em campos novos (`members`, `usedBy`), publique as regras no console do Firebase antes de publicar o site.
- O frontend contém apenas a configuração pública do aplicativo. Não há chaves administrativas.
- A tabela de salas não é pública: somente membros autenticados podem ler. Convites só podem ser listados pelo dono da sala correspondente.
- Recomendado no console: restringir a chave de API por referenciador HTTP (ernandes-sobreira.github.io) e ativar o App Check.

## Logos

Os PNGs fornecidos pelo responsável foram incorporados com suas proporções originais. Atenção: a logo do ProfÁgua tem 89 x 37 px e os brasões cerca de 110 px; no Word impresso saem borrados. Substituir por arquivos de pelo menos 600 px de largura em `profagua-marcas.js`. CAPES e ANA são imagens separadas. O Word não recomprime os PNGs nem aplica a antiga correção de fundo preto aos novos brasões.
