const { ApolloServer, gql } = require("apollo-server");
const db = require("./db");

async function main() {
  const mysql = require("mysql2/promise");

  // const connection = mysql.createConnection({
  //     host: 'localhost',
  //     user: 'root',
  //     password: '',
  //     database: 'student',
  //   });

  var db = require("knex")({
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "",
      database: "student",
      charset: "utf8",
    },
  });

  module.exports = { db };

  const typeDefs = gql`
    type Student {
      id: Int
      name: String
      age: Int
    }

    type Query {
      student: [Student]
    }
    type Mutation {
      createStudent(name: String, age: Int): Student
    }
  `;

  const resolvers = {
    //ถูกรีเทินหรือแสดงออกมาเป็นแบบไหน
    Query: {
      // ถ้าพิมคำว่าuser

      student: async () => {
        return await db("student").select("*");

        // return students
      },
    },
    Mutation: {

      async createStudent(parent, arg) {
        const { name, age } = arg;
         await db(`student`)
          .insert({
            name: name,
            age: age,
          })
          .then(function (response) {
            console.log(`INSERT SUCCESS STUDENT ${response}`);
            return { status: true, responseID: response };
          })
          .catch((error) => {
            console.log(`THIS IS TROWE ERROR  : ${error}`);
          });
          return ["success", true]
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers,path: '/api/v1', });
  server.listen().then(({ url }) => {
    console.log(`server runin on port ${url}`);
  });
}

main();
