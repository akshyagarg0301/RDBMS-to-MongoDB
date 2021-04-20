const mongoose = require("mongoose");

//Step-0 using that database
//connecting to the mongoose database
mongoose
  .connect("mongodb://localhost:27017/newMapping", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("We are Conntcted!!");
  })
  .catch((err) => {
    console.log("ERROR Connecting to Database!!");
  });

//Step-1
//As Department is refered by other tables but is doesn't have any foreign key
const departmentSchema = new mongoose.Schema({
  _id: Number,
  department_name: String,
});

const Department = mongoose.model("Department", departmentSchema);
const insertDepartment = async function () {
  const data = await Department.insertMany([
    { _id: 1, department_name: "Physics" },
    { _id: 2, department_name: "Maths" },
  ]);
  // await Department.deleteMany({});
  console.log(data);
};

 insertDepartment().then(() => {
   mongoose.connection.close();
 });

const showDepartment = async function () {
  const data = await Department.find({});
  console.log(data);
};

// showDepartment().then(() => {
//   mongoose.connection.close();
// });

//Step-2
//Employee Table is Reffered by other Tables but has only one Forrign Key
const employeeSchema = new mongoose.Schema({
  _id: Number,
  employee_name: String,
  employee_address: String,
  department: {
    type: Number,
    ref: "Department",
  },

  // Step-3(ii): CASE-OF => ONE:MANY
  // child tables had only one foreign key and were not reffered by any other table we do One Way embedding
  child: [
    {
      type: Number,
      ref: "Child",
    },
  ],

  //Step-3(iii): CASE-OF => ONE:ONE
  //contact_info had only one foreign key and is not referred by any other table and also on employee has only one contact info
  //so we would use Direct Embedding
  contactInfo: [
    {
      _id: { id: false },
      phoneNo: String,
      City: String,
    },

    //step-4: works_on is N:M relation and we'll deal it by two way embedding
  ],

  worksOn: [
    {
      _id: { id: false },
      project_id: {
        type: Number,
        ref: "Project",
      },
      hours: Number,
    },
  ],
});

const Employee = mongoose.model("Employee", employeeSchema);
const insertEmployee = async function () {
  const data = await Employee.insertMany([
    {
      _id: 1,
      employee_name: "Alan",
      employee_address: "201, 21st jump street, NY",
      department: 1,
      child: [2],
      contactInfo: {
        phoneNo: "9595952201",
        City: "ABC",
      },
      worksOn: [
        {
          project_id: 1,
          hours: 5,
        },
        {
          project_id: 2,
          hours: 3,
        },
      ],
    },
    {
      _id: 2,
      employee_name: "Bob",
      employee_address: "331, 22st jump street, NY",
      department: 2,
      child: [1, 4],
      contactInfo: {
        phoneNo: "5269233161",
        City: "XYZ",
      },
      worksOn: [
        {
          project_id: 2,
          hours: 3,
        },
        {
          project_id: 3,
          hours: 2,
        },
        {
          project_id: 5,
          hours: 5,
        },
        {
          project_id: 4,
          hours: 8,
        },
      ],
    },
    {
      _id: 3,
      employee_name: "Carry",
      employee_address: "41, 23st jump street, NY",
      department: 1,
      child: [3],
      contactInfo: {
        phoneNo: "1234506789",
        City: "PQR",
      },
      worksOn: [
        {
          project_id: 4,
          hours: 10,
        },
      ],
    },
  ]);
  // await Employee.deleteMany({});
  console.log(data);
};

// insertEmployee().then(() => {
//   mongoose.connection.close();
// });

const showEmployee = async function () {
  const data = await Employee.find({})
    .populate("child")
    .populate("department")
    .populate("worksOn.project_id");
  console.log(data);
};

// showEmployee().then(() => {
//   mongoose.connection.close();
// });

//Project Tabel is also Reffered by other Tables and only has one foreign key
const projectSchema = new mongoose.Schema({
  _id: Number,
  project_name: String,
  project_duration: String,
  department: {
    type: Number,
    ref: "Department",
  },

  //step-4(ii): works_on is N:M relation and we'll deal it by two way embedding
  workedBy: [
    {
      _id: { id: false },
      employee_id: {
        type: Number,
        ref: "Employee",
      },
      hours: Number,
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

const insertProject = async function () {
  const data = await Project.insertMany([
    {
      _id: 1,
      project_name: "xyz",
      project_duration: "3 weeks",
      department: 2,
      workedBy: [
        {
          employee_id: 1,
          hours: 5,
        },
      ],
    },
    {
      _id: 2,
      project_name: "abc",
      project_duration: "2 weeks",
      department: 1,
      workedBy: [
        {
          employee_id: 2,
          hours: 3,
        },
        {
          employee_id: 1,
          hours: 3,
        },
      ],
    },
    {
      _id: 3,
      project_name: "pqr",
      project_duration: "1 weeks",
      department: 1,
      workedBy: [
        {
          employee_id: 2,
          hours: 2,
        },
      ],
    },
    {
      _id: 4,
      project_name: "mno",
      project_duration: "3 weeks",
      department: 2,
      workedBy: [
        {
          employee_id: 3,
          hours: 10,
        },
        {
          employee_id: 2,
          hours: 8,
        },
      ],
    },
    {
      _id: 5,
      project_name: "ghi",
      project_duration: "3 weeks",
      department: 1,
      workedBy: [
        {
          employee_id: 2,
          hours: 5,
        },
      ],
    },
  ]);
  console.log(data);
};

// insertProject().then(() => {
//   mongoose.connection.close();
// });

const showProject = async function () {
  const data = await Project.find({})
    .populate("department")
    .populate("workedBy.employee_id");
  console.log(data[0].workedBy);
};

//showProject().then(() => {
  //mongoose.connection.close();
//});

//Step-3(i): will creat a child table and will do one way embedding in employee table
const childSchema = new mongoose.Schema({
  _id: Number,
  child_name: String,
});

const Child = mongoose.model("Child", childSchema);

const insertChild = async function () {
  const data = await Child.insertMany([
    {
      _id: 1,
      child_name: "Max",
    },
    {
      _id: 2,
      child_name: "Harry",
    },
    {
      _id: 3,
      child_name: "Chad",
    },
    {
      _id: 4,
      child_name: "Shwan",
    },
  ]);
  console.log(data);
};

// insertChild().then(() => {
//   mongoose.connection.close();
// });

const showChild = async function () {
  const data = await Child.find({}); //.populate("department");
  console.log(data);
};

// showChild().then(() => {
//   mongoose.connection.close();
// });

// const worksONSchema = mongoose.Schema({
//   _id: Number,
//   emp_id: {
//     type: Number,
//     ref: "Employee",
//   },
//   pro_id: {
//     type: Number,
//     ref: "Project",
//   },
//   hours: String,
// });
