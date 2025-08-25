import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { TelecomUser } from '../../../core/models/telecom-user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: TelecomUser[] = [];
  selectedUser: TelecomUser = { id: 0, name: '', phone: '', email: '' };
  editMode = false;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe(users => this.users = users);
  }

  addUser() {
    this.selectedUser = { id: null, name: '', phone: '', email: '' };
    this.editMode = false;
  }

  editUser(user: TelecomUser) {
    this.selectedUser = { ...user };
    this.editMode = true;
  }

  saveUser() {
    if (this.editMode && this.selectedUser.id) {
      this.apiService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.cancelEdit();
      });
    } else {
      this.apiService.createUser(this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.addUser();
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure?')) {
      this.apiService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }

  cancelEdit() {
    this.selectedUser = { id: 0, name: '', phone: '', email: '' };
    this.editMode = false;
  }
}