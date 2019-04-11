const graphql = require('graphql');
const { Pool, Client } = require('pg');
const pgp = require('pg-promise')();
require('dotenv').config();

//make sure to replace my db string & creds with your own
const config = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
};
const db = pgp(config);

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema,
    GraphQLInt
} = graphql;

const RoleType = new GraphQLObjectType({
    name: "role",
    type: "Query",
    fields: {
        role_id: { type: GraphQLString },
        role_name: { type: GraphQLString }
    }
});

const AccountRoleType = new GraphQLObjectType({
    name: "account_role",
    type: "Query",
    fields: {
        user_id: { type: GraphQLString },
        role_id: { type: GraphQLString },
        grant_date: { type: GraphQLString },
        role :{
            type: new GraphQLList(RoleType),
            resolve(parentValue, args) {
                console.log('parentValue.id --> ' + parentValue.user_id);
                const query = `SELECT * FROM role WHERE role_id=$1`;
                const values = [parentValue.role_id];
                return db
                    .any(query, values)
                    .then(res => {
                        console.log('AccountType role res =>' + JSON.stringify(res));
                        return res;
                    })
                    .catch(err => err);
            }
        }
    }
});

const AccountType = new GraphQLObjectType({
    name: "account",
    type: "Query",
    fields: {
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        email: { type: GraphQLString },
        created_on: { type: GraphQLString },
        last_login: { type: GraphQLString },
        account_role: {
            type: new GraphQLList(AccountRoleType),
            resolve(parentValue, args) {
                console.log('parentValue.id --> ' + parentValue.user_id);
                const query = `SELECT * FROM account_role WHERE user_id=$1`;
                const values = [parentValue.user_id];
                return db
                    .any(query, values)
                    .then(res => {
                        console.log('AccountType account_role res =>' + JSON.stringify(res));
                        return res;
                    })
                    .catch(err => err);
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        account: {
            type: new GraphQLList(AccountType),
            args: {
                id: { type: GraphQLID }
            },
            resolve(parentValue, args) {
                console.log(args.id);
                const query = `SELECT * FROM account WHERE user_id=$1`;
                const values = [args.id];

                return db
                    .any(query, values)
                    .then(res => res)
                    .catch(err => err);

            }
        },
        account_role: {
            type: new GraphQLList(AccountRoleType),
            args: { id: { type: GraphQLID } },
            resolve(parentValue, args) {
                const query = `SELECT * FROM account_role WHERE user_id=$1`;
                const values = [args.id];

                return db
                    .any(query, values)
                    .then(res => {
                        console.log('account_role res =>' + JSON.stringify(res));
                        return res;
                    })
                    .catch(err => err);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})