import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api';

  getMyProfile() {
    return this.http.get<any>(`${this.apiUrl}/users/me`);
  }

  updateProfile(data: any) {
    return this.http.put<any>(`${this.apiUrl}/users/me`, data);
  }

  getCoursierProfile() {
    return this.http.get<any>(`${this.apiUrl}/coursiers/me`);
  }

  updateCoursierProfile(data: any) {
    return this.http.put<any>(`${this.apiUrl}/coursiers/me`, data);
  }

  changerDisponibilite(disponibilite: string) {
    return this.http.patch<any>(
      `${this.apiUrl}/coursiers/me/disponibilite?disponibilite=${disponibilite}`,
      {}
    );
  }

  deleteProfile() {
    return this.http.delete(`${this.apiUrl}/users/me`, { responseType: 'text' });
  }


  changePassword(ancienMotDePasse: string, nouveauMotDePasse: string) {
  return this.http.put(
    `${this.apiUrl}/users/me/password`,
    { ancienMotDePasse, nouveauMotDePasse },
    { responseType: 'text' }
  );
}

getMerchantProfile() {
  return this.http.get<any>(`${this.apiUrl}/merchants/me`);
}

updateMerchantProfile(data: any) {
  return this.http.put<any>(`${this.apiUrl}/merchants/me`, data);
}




getAllCoursiers() {
  return this.http.get<any[]>(`${this.apiUrl}/coursiers`);
}

validerCoursier(id: number) {
  return this.http.patch<any>(`${this.apiUrl}/coursiers/${id}/valider`, {});
}

refuserCoursier(id: number) {
  return this.http.patch<any>(`${this.apiUrl}/coursiers/${id}/refuser`, {});
}


getAllMerchants() {
  return this.http.get<any[]>(`${this.apiUrl}/merchants`);
}

validerMerchant(id: number) {
  return this.http.patch<any>(`${this.apiUrl}/merchants/${id}/valider`, {});
}

suspendreMerchant(id: number) {
  return this.http.patch<any>(`${this.apiUrl}/merchants/${id}/suspendre`, {});
}

}