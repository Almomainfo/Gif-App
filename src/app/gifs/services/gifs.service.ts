import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse,Gif } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {
public gifsList:Gif[] = [];
private apiKey:       string = 'sEV3MtVUgRysRUpUIPubM77D3L5nX8lw';
private serviceUrl:   string = 'https://api.giphy.com/v1/gifs'
private _tagsHistory: string[] = [];

  constructor(private http:HttpClient) {
    this.loadLocalStorage();
    console.log('Gif service Ready')
  }

get tagsHistory(){
  return [...this._tagsHistory];
}

private organizeHistory(tag:string){
  tag = tag.toLowerCase();

  if(this._tagsHistory.includes(tag)){
    this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
  }
  this._tagsHistory.unshift(tag);
  this._tagsHistory = this._tagsHistory.splice(0,10);
  this.saveLocalStorage();
}

private saveLocalStorage():void{
  localStorage.setItem('history',JSON.stringify(this._tagsHistory));
}

private loadLocalStorage():void{
  if (!localStorage.getItem('history')) return;
  this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  this.searchTag(this._tagsHistory[0])
}


searchTag(tag:string):void{
  if(tag.length === 0) return;
  this.organizeHistory(tag);
  console.log(this.tagsHistory);

  const params = new HttpParams()
  .set('api_key',this.apiKey)
  .set('q',tag)
  .set('limit',10)
  this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params})
  .subscribe((resp) =>{
    this.gifsList = resp.data;
    //console.log({gifs:this.gifsList});
  })
}

}
