

// export interface IUser extends RowDataPacket {
//   count?: number
//   max?: number
// }

export interface CountInterface {
  count: number
}
// fname, lname, designation, address1, address2, city, phonenumber, email, gender, states, zipcode, relationshipstatus, DOB, nameofboard, passingyear, percentage, companyname, pastdesignation, from, to, lang, hindi, english, gujarati, tech, php, mysql, laravel, oracle, name, contactnumber, relation, preferredlocation, noticeperiod, expectedctc, currentctc, department,

export interface JobAppForm {
  fname: string
  lname: string
  designation: string
  address1: string
  address2: string | undefined
  city: string
  phonenumber: BigInt
  email: string
  gender: string
  states: string
  zipcode: string
  relationshipstatus: string
  DOB: Date
  nameofboard: string[]
  passingyear: number[]
  percentage: number[]
  companyname: string[]
  pastdesignation: string[]
  from: Date[]
  to: Date[]
  lang: string[]
  tech: string[]
  name: string[]
  contactnumber: string[]
  relation: string[]
  preferredlocation: string[]
  noticeperiod: string
  expectedctc: string
  currentctc: string
  department: string
}

// firstname, lastname, email, mono, activationcode

export interface RegistrationInterface {
  firstname: string
  lastname: string
  email: string
  mono: BigInt
  activationcode: string
}

export interface GroupByInterface {
  make: string
  model: string
  year: number
}

export interface groupByResultInterface {

  audi: Array<GroupByInterface>
  ford: Array<GroupByInterface>
  kia: Array<GroupByInterface>

}

export interface vowelInterface {
  VowelStr: string[]
  consonantStr: string[]
  res: string
}

export interface OddEvenInterface {
  even: number[]
  odd: number[]
  str: string
}