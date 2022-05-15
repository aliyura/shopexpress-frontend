import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public save(key: string, value: string) {
    return localStorage.setItem(key, value);
  }
  public get(key: string) {
    return localStorage.getItem(key);
  }
  public remove(key: string) {
    localStorage.removeItem(key);
  }
  public clear() {
    localStorage.clear();
  }
  public saveSession(key: string, value: string) {
    return sessionStorage.setItem(key, value);
  }
  public getSession(key: string) {
    return sessionStorage.getItem(key);
  }
  public removeSession(key: string) {
    sessionStorage.removeItem(key);
  }
  public clearSession() {
    sessionStorage.clear();
  }
  public recheck(callback,delay){
     setInterval(function(){
      callback();
    },delay);
  }
}
