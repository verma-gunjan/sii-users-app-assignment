import { Injectable, NotFoundException } from '@nestjs/common';
import { users } from 'src/mock_data/data';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  // keeping a local copy
  private users = [...users]

  // Get all users
  findAll(){
    return this.users;
  }

  // Get users by id
  findOne(id: number){
    const user = this.users.find(u => u.id === id);
    if(!user) throw new NotFoundException('User not found');
    return user;
  }

  // Post create new user
  create(createUserDto: CreateUserDto){
    const newUser = {
      id: this.users.length + 1, // auto-increment ID
      ...createUserDto
    };
    this.users.push(newUser);
    return newUser;
  }

  // Patch update user
  update(id: number, updateUserDto: UpdateUserDto){
    const user = this.findOne(id);
    Object.assign(user, updateUserDto);
    return user;
  }

  // Delete user
  remove(id: number){
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException('User not found');
    return this.users.splice(index, 1)[0];
  }

   // GET /users/managed/:id
   getManagedUsers(id: number) {
    const user = this.findOne(id);
    if (!user.roles.includes('ADMIN')) return [];
    return this.users.filter(u =>
      u.groups.some(g => user.groups.includes(g))
    );
  }
}
