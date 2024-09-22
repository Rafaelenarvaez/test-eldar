import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  constructor(private http: HttpClient) { }

  list(): Observable<any> {
    return new Observable(observer => {
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => {
          observer.next(json);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  create(data: any): Observable<any> {
    return new Observable(observer => {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(json => {
          observer.next(json);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  edit(id: number, data: any): Observable<any> {
    return new Observable(observer => {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(response => response.json())
      .then(json => {
        observer.next(json);
        observer.complete();
      })
      .catch(error => observer.error(error));
    });
  }

  delete(id: number): Observable<any> {
    return new Observable(observer => {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(json => {
        observer.next(json);
        observer.complete();
      })
      .catch(error => observer.error(error));
    });
  }


}