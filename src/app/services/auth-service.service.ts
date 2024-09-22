import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' }
  ];

  login(username: string, password: string): { success: boolean, role?: string } {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('token', 'fake-jwt-token');
      localStorage.setItem('role', user.role);
      return { success: true, role: user.role };
    } else {
      return { success: false };
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}