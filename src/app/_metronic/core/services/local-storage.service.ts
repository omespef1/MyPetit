import { Injectable } from "@angular/core";
import { AuthModel } from "src/app/modules/auth/_models/auth.model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor() {}

  public setAuthFromLocalStorage(auth: AuthModel): boolean {
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
  }
}
