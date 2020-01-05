const Employee = require("../../models/employee");
const Address = require("../../models/address");
const Skill = require("../../models/skill");

const { transformEmployee } = require("./merge");

module.exports = {
  employees: async () => {
    try {
      const employees = await Employee.find();
      return employees.map(employee => {
        return transformEmployee(employee);
      });
    } catch (error) {
      throw error;
    }
  },
  createEmployee: async (args, req) => {
    const employee = new Employee({
      firstname: args.employeeInput.firstname,
      lastname: args.employeeInput.lastname
    });

    const address = new Address({
      line1: args.employeeInput.addresses[0].line1,
      line2: args.employeeInput.addresses[0].line2,
      city: args.employeeInput.addresses[0].city,
      state: args.employeeInput.addresses[0].state,
      zipcode: args.employeeInput.addresses[0].zipcode
    });

    const skill = new Skill({
      name: args.employeeInput.skills[0].name
    });

    try {
      await address.save();
      await skill.save();

      employee.addresses.push(address);
      employee.skills.push(skill);

      const result = await employee.save();
      const createdEmployee = transformEmployee(result);

      return createdEmployee;
    } catch (error) {
      throw error;
    }
  },
  deleteEmployee: async (args, req) => {
    try {
      const employee = await Employee.findById(args.employeeId);

      if (!employee) {
        throw new Error("Employee not found");
      }

      const addressId = employee.addresses[0]._id;
      const address = await Address.findById(addressId);

      const skillId = employee.skills[0]._id;
      const skill = await Skill.findById(skillId);

      await address.remove();
      await skill.remove();
      await employee.remove();

      return transformEmployee(employee);
    } catch (error) {
      throw error;
    }
  },
  updateEmployee: async (args, req) => {
    try {
      const updatedEmployee = {
        ...args.updateEmployeeInput
      };

      const employee = await Employee.findByIdAndUpdate(
        args.updateEmployeeInput._id,
        updatedEmployee
      );

      // validate if address ids were sent
      if (
        typeof args.updateEmployeeInput.addresses != "undefined" &&
        args.updateEmployeeInput.addresses.length > 0
      ) {
        const updatedAddress = {
          ...args.updateEmployeeInput.addresses[0]
        };

        await Address.findByIdAndUpdate(
          args.updateEmployeeInput.addresses[0]._id,
          updatedAddress
        );
      }

      // validate if skills ids were sent
      if (
        typeof args.updateEmployeeInput.skills != "undefined" &&
        args.updateEmployeeInput.skills.length > 0
      ) {
        const updatedSkill = {
          ...args.updateEmployeeInput.skills[0]
        };

        await Skill.findByIdAndUpdate(
          args.updateEmployeeInput.skills[0]._id,
          updatedSkill
        );
      }

      return transformEmployee(employee);
    } catch (error) {
      throw error;
    }
  }
};
