# backend-express-multer-sharp-firebase-storage-example
### Exemplo de backend utilizando Express.js, Multer, Sharp e Firebase Storage
#### Instalação
Baixe o repositório
```sh
$ git clone https://github.com/rodrigocamarano/backend-express-multer-sharp-firebase-storage-example.git
```
Acesse o diretório da aplicação e instale os módulos do Node.js que serão utializados no projeto
```sh
$ cd backend-express-multer-sharp-firebase-storage-example
$ yarn
```
Crie um projeto no **Firebase** 
```sh
https://console.firebase.google.com
```
### Selecione o projeto criado
- No ícone de engrenagem localizado no canto esquerdo superior clique em **Configurações do projeto**
- Clique em **Contas de serviço** e em **Gerar nova chave privada**
- Baixe o arquivo gerado no diretório **key** já existente no projeto e renomei-o para **firebase.json**
- No canto esquerdo da tela clique em **Storage** e habilite o recurso
- Ainda em **Storage**, acesse **Rules** e configure da seguinte forma
```sh
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}

```
Crie uma conta e no diretório raiz crie o arquivo **nodemon.json** e substitua **project.appspot.com** pelo projeto gerado pelo **Firebase**
```sh
{
    "env": {
        "STORAGE": "project.appspot.com"
    }
}
```
Para iniciar os testes, execute 
```sh
$ yarn start
```
### Testes
Para o teste foi utilizado o Insomnia (https://insomnia.rest/download/)
- Crie uma requisição utilizando o método **PUT**  / **Multipart**. Em *name*, preencha com **image** e em *value*, com selecione **File** e em seguida selecione uma imagem com a extensão **JPG**, **JPEG** ou **PNG**
```sh
http://localhost:8080/image
```
A requisição retornará um um JSON conforme exemplo
```sh
{
  "file": "2020-05-18T18:47:08.377Z.jpeg"
}
```
- Crie uma requisição utilizando o método **POST**  / **JSON**. 
- Em seguida preencha o **JSON** com o resultado gerado no médo anterior
```sh
{
	"file": "2020-05-18T18:47:08.377Z.jpeg"
}
```
A requisição retornará um um JSON conforme exemplo contendo o endereço da imagem gerada