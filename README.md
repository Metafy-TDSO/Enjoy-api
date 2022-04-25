# iFindy

## 🎯 Objetivo
Esse app representa o serviço de backend principal da aplicação iFindy, desenvolvido em Node.js com ferramentas como:
- [Node.js](https://nodejs.org/);
- [Socket.io](https://socket.io/);
- [Typescript](https://www.typescriptlang.org/);
- [Fastify](https://www.fastify.io/);
- [Docker](https://www.docker.com/);
- [Prisma.io](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)


## 📃 Documentação
A documentação das rotas **REST** disponíveis, assim como seus parâmetros, respostas e modelos podem ser acessados através do _endpoint_ [documentation](http://localhost:3000/documentation) ou pela [documentação em produção](https://eventos-v1-api.herokuapp.com/documentation).

## 🧪 Testes
Você também pode visualizar os testes realizados na [documentação de testes da api](./docs//api-tests.md).

<br />

## 🤔 Como executar?
Há dois meios possíveis de executar essa aplicação, a primeira utilizando o Docker, uma ferramenta de containerização de serviços, ou localmente no seu sistema, os tópicos abaixo descreverão como realizar essas duas alterantivas:

### 🐳 Utilizando Docker
1. Tenha instalado os serviços do Docker; ✔️
   - _É necessário ter o [Docker Compose](https://docs.docker.com/compose/), versões mais atuais do Docker já incluem esse serviço, mas caso você não tenha, deverá instalá-lo;_
2. Rode os comandos: ✔️
    ```
    # Caso tenha o Docker Compose instalado do Docker
    $ docker compose up -d --build

    # Caso não tenha
    $ docker-compose up -d --build
    ``` 
3. Após a instalação das imagens do banco de dados e da aplicação, dois containers serão inicializados em sua máquina; ✔️
4. A aplicação aplicará as migrações no banco de dados após sua inicialização
   - _Obs: caso a aplicação não funcione, experimente rodar o comando de criação novamente_; ✔️
5. O banco de dados MySQL estará disponível para ser acessado localmente através [da url do Docker](./.env.example) na porta externa 3307.
6. A aplicação estará disponível através da [porta 3333](http://localhost:3333).

As configurações padrões da aplicação e do banco MySQL estão definidas no arquivo [docker-compose.yml](./docker-compose.yml).

### 🤖 Executando Localmente
1. Tenha o **Node** e o **Yarn** instalados em sua máquina; ✔️
     - Obs: _O yarn precisa estar instalado na sua última versão, você pode instalá-lo com o NPM a partir do comando: `npm install --global yarn`_.
2. Rode `yarn install` para instalar as dependências do projeto; ✔️
3. Crie um arquivo **.env** com as variáveis de ambiente conforme explicitado no arquivo [.env example](.env.example);
4. Rode `yarn db:deploy` para aplicar as migrações locais no seu banco de dados;
   - _Obs: Caso a aplicação não seja capaz de achar seu banco de dados, tenha certeza que a url do banco de dados no arquivo .env está correto._
   - Você também pode utilizar o banco de dados criado a partir do **Docker**;
5. Rode `yarn dev` para rodar a aplicação no ambiente de desenvolvimento; ✔️
6. Rode `yarn build` para criar a versão buildada do app na pasta **dist**; ✔️
7. Rode `yarn start` para rodar o app buildado como se fosse em um ambiente de produção; ✔️

----

Feito pelo time [Metafy](https://github.com/Metafy-TDSO).
