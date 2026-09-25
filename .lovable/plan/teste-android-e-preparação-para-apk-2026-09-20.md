# Teste Android e preparação para APK

## Objetivo
Validar o Caramelo Run Adventures como aplicativo Android, corrigindo somente problemas comprovados e deixando a configuração do Capacitor pronta para gerar o projeto nativo.

## Etapas
1. Executar uma sessão prolongada em viewport Android, medindo taxa de quadros, memória JavaScript, estabilidade visual e erros durante início, gestos, coleta e colisão.
2. Simular deslizes nas quatro direções e verificar latência e resposta sem alterar as regras dos controles.
3. Validar áudio, preferência salva e chamada de vibração; confirmar limitações do preview para recursos físicos do aparelho.
4. Corrigir apenas defeitos encontrados nos testes, incluindo vazamentos de timers, áudio ou eventos se existirem.
5. Instalar e alinhar as dependências oficiais do Capacitor, ajustar scripts/configuração e gerar/sincronizar a pasta Android quando o formato de saída web for compatível.
6. Validar o pacote final, revisar diagnósticos e informar claramente se está pronto para abrir no Android Studio e gerar o APK.

## Detalhes técnicos
- O jogo e sua lógica permanecerão intactos.
- O teste terá perfil móvel de 411×688 e sessão longa para observar degradação de FPS ou memória.
- A vibração real só pode ser confirmada em aparelho Android; no preview será validada a chamada da API.
- A preparação nativa usará Capacitor oficial e o conteúdo web estático produzido pelo projeto.
