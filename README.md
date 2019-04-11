
## graphql_nodejs_postgres

    $ git clone https://github.com/bhavinsa/graphql_nodejs_postgres.git
    $ cd graphql_nodejs_postgres
    $ npm install
    $ node app.js
    
#####  Open [http://localhost:4000/graphql](http://localhost:4000/graphql)  & add below GraphQL query: 

    query{
       account(id: 2) {
        username
      	email,
        account_role{
          role_id,
          role{
            role_name
          }
        }
      }
    }

##### N.B: You can find the database script inside 'db_script.txt'
