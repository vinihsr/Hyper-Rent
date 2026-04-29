Readme · MD
# Hyper-Rent
 
Plataforma de aluguel de carros com painel administrativo e suporte a extração de dados via API Keys.

---
 
## Sobre
 
O Hyper-Rent é uma aplicação web para gerenciamento de aluguel de veículos. Conta com interface para clientes e um painel administrativo (DE) com geração de chaves de API para extração e integração de dados de forma segura.
 
---
 
## Estrutura
 
```
Hyper-Rent/
├── client/      
├── server/       
├── nginx/        
└── package-lock.json
```
 
---
 
## Tecnologias
 
| Camada   | Tecnologia            |
|----------|-----------------------|
| Frontend | JavaScript(React) |
| Backend  | Node.js(Express)               |
| Proxy    | Nginx                 |
 
---
 
## API Keys — Painel Administrativo (DE)

O painel admin suporta criação e gerenciamento de chaves de API, permitindo:

Gerar chaves únicas para extração de dados (DE)
Controlar permissões por chave
Revogar ou regenerar chaves existentes
Integrar sistemas externos ao painel de forma segura

A idea é disponibilizar dados pré analisados via API key. Ou seja, carros e quantas vezes já foram reservados, carros por ano, entre outros. No momento, temos os carros apenas. Sem dados dos clientes, 
iremos disponibilizar termos e condições que mantenham o cliente ciente de analises com seus dados, filtrando os clientes disponíveis em um endpoint.

Em desenvolvimento...
