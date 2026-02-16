const { gql } = require("graphql-tag");

module.exports = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }
  
  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    employee_photo: String 
    created_at: Date
    updated_at: Date
  }

  type AuthPayload {
    message: String!
    token: String
    user: User
  }

  type GenericResponse {
    message: String!
  }

  type EmployeeResponse {
    message: String!
    employee: Employee
  }

  type EmployeesResponse {
    message: String!
    employees: [Employee!]!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username_or_email: String!
    password: String!
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    getAllEmployees: EmployeesResponse!
    getEmployeeByEid(eid: ID!): EmployeeResponse!
    searchEmployees(designation: String, department: String): EmployeesResponse!
    me: User
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    addEmployee(input: AddEmployeeInput!): EmployeeResponse!
    updateEmployeeByEid(eid: ID!, input: UpdateEmployeeInput!): EmployeeResponse!
    deleteEmployeeByEid(eid: ID!): GenericResponse!
  }

`;