import { HttpClient } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ActionResult } from '../_models/action-result';
import { Types } from '../_models/Types.model';

const URL = 'http://localhost/MyPetti-Backend/api/Tipes';

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  constructor(private http: HttpClient) { }

  GetTypes() {
    return this.http.get<ActionResult<any>>(`${URL}/GetTipes`);
  }

  GetType(ID: number) {
    return this.http.get<ActionResult<any>>(`${URL}/GetType?ID=${ID}`);
  }

  PutTipes(ID: number, Values: Types) {
    return this.http.put<ActionResult<any>>(`${URL}/PutTipes`, { ID:ID, Values:Values });
  }

  AddTipes(NAME_T: string) {
    return this.http.post<ActionResult<any>>(`${URL}/AddTipes?Name=${NAME_T}`, null);
  }

  DeleteTipes(ID: number) {
    return this.http.delete<ActionResult<any>>(`${URL}/DeleteTipes=${ID}`);
  }
}
