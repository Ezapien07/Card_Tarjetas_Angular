import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private myappURL = 'https://localhost:7008/';
  private myapiURL = 'api/Tarjeta/';

  constructor(private http: HttpClient) {}

  getListTarjetas(): Observable<any> {
    return this.http.get(this.myappURL + this.myapiURL, { withCredentials: true });

  }

  deleteTarjeta(id:number):Observable<any>{
    return this.http.delete(this.myappURL+this.myapiURL+id,{withCredentials:true});
  }

  saveTarjeta(tarjeta:any):Observable<any>{
    return this.http.post(this.myappURL+this.myapiURL,tarjeta,{withCredentials:true});
  }
  updateTarjeta(id:number,tarjeta:any):Observable<any>{
    return this.http.delete(this.myappURL+this.myapiURL+id,tarjeta);
  }
}
