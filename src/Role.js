class Role {
  constructor(id, name, type, color) {
    this.id = id;
    this.name = name;
    this.type = type;  // "kp", "dicer", or "pc"
    this.color = color;
  }
}

class RoleTable {
  constructor() {
    this.table = {};   // {id: Role}
    this.nextRoleID = 0;
  }

  getName(id) {
    if (id >= 0 && id < this.nextRoleID) {
      return this.table[id].name;
    }
  }

  setName(id, name) {
    if (id >= 0 && id < this.nextRoleID) {
      this.table[id].name = name;
    }
  }

  getType(id) {
    if (id >= 0 && id < this.nextRoleID) {
      return this.table[id].type;
    }
  }

  setType(id, type) {
    if (id >= 0 && id < this.nextRoleID) {
      this.table[id].type = type;
    }
  }

  getColor(id) {
    if (id >= 0 && id < this.nextRoleID) {
      return this.table[id].color;
    }
  }

  setColor(id, color) {
    if (id >= 0 && id < this.nextRoleID) {
      this.table[id].color = color;
    }
  }

  getRoleIdByName(name) {
    let roleArray = Object.values(this.table);
    for (let i = 0; i < roleArray.length; i++) {
      if (roleArray[i].name === name) {
        return roleArray[i].id;
      }
    }
    return null;
  }

  // add a role by its name and type and return its ID,
  // except the name has already occurred in the role table (return its id)
  addRole(roleName, roleType, roleColor) {
    let existRoleID = this.getRoleIdByName(roleName);
    if (existRoleID || existRoleID === 0) {
      return existRoleID;
    } else {
      this.table[this.nextRoleID] = new Role(this.nextRoleID, roleName, roleType, roleColor);
      this.nextRoleID += 1;
      return this.nextRoleID - 1;
    }
  }
}

export {
  Role,
  RoleTable,
};